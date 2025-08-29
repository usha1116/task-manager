const request = require('supertest');
const mongoose = require('mongoose');
const app = require('../server');
const User = require('../models/User');
const Task = require('../models/Task');

describe('Task Endpoints', () => {
  let adminUser, memberUser, adminToken, memberToken;

  beforeAll(async () => {
    // Connect to test database
    await mongoose.connect(process.env.MONGODB_URI_TEST);
  });

  afterAll(async () => {
    // Clean up and disconnect
    await mongoose.connection.dropDatabase();
    await mongoose.connection.close();
  });

  beforeEach(async () => {
    // Clear data before each test
    await User.deleteMany({});
    await Task.deleteMany({});

    // Create admin user
    const adminResponse = await request(app)
      .post('/api/auth/register')
      .send({
        name: 'Admin User',
        email: 'admin@example.com',
        password: 'password123',
      });

    adminUser = adminResponse.body.user;
    adminToken = adminResponse.body.token;

    // Update admin user role
    await User.findByIdAndUpdate(adminUser.id, { role: 'admin' });

    // Create member user
    const memberResponse = await request(app)
      .post('/api/auth/register')
      .send({
        name: 'Member User',
        email: 'member@example.com',
        password: 'password123',
      });

    memberUser = memberResponse.body.user;
    memberToken = memberResponse.body.token;
  });

  describe('POST /api/tasks', () => {
    it('should create a new task successfully', async () => {
      const taskData = {
        title: 'Test Task',
        description: 'This is a test task',
        status: 'todo',
        priority: 'medium',
        dueDate: new Date(Date.now() + 7 * 24 * 60 * 60 * 1000).toISOString(), // 7 days from now
        assignee: memberUser.id,
        tags: ['test', 'important'],
      };

      const response = await request(app)
        .post('/api/tasks')
        .set('Authorization', `Bearer ${adminToken}`)
        .send(taskData)
        .expect(201);

      expect(response.body.success).toBe(true);
      expect(response.body.data.title).toBe(taskData.title);
      expect(response.body.data.description).toBe(taskData.description);
      expect(response.body.data.status).toBe(taskData.status);
      expect(response.body.data.priority).toBe(taskData.priority);
      expect(response.body.data.assignee).toBe(memberUser.id);
      expect(response.body.data.tags).toEqual(taskData.tags);
    });

    it('should validate required fields', async () => {
      const response = await request(app)
        .post('/api/tasks')
        .set('Authorization', `Bearer ${adminToken}`)
        .send({})
        .expect(400);

      expect(response.body.success).toBe(false);
      expect(response.body.errors).toBeDefined();
    });
  });

  describe('GET /api/tasks', () => {
    beforeEach(async () => {
      // Create test tasks
      const taskData = [
        {
          title: 'Task 1',
          description: 'First task',
          status: 'todo',
          priority: 'high',
          dueDate: new Date(Date.now() + 1 * 24 * 60 * 60 * 1000),
          assignee: memberUser.id,
          createdBy: adminUser.id,
          tags: ['urgent'],
        },
        {
          title: 'Task 2',
          description: 'Second task',
          status: 'in-progress',
          priority: 'medium',
          dueDate: new Date(Date.now() + 2 * 24 * 60 * 60 * 1000),
          assignee: memberUser.id,
          createdBy: adminUser.id,
          tags: ['ongoing'],
        },
        {
          title: 'Task 3',
          description: 'Third task',
          status: 'done',
          priority: 'low',
          dueDate: new Date(Date.now() - 1 * 24 * 60 * 60 * 1000), // Past due
          assignee: memberUser.id,
          createdBy: adminUser.id,
          tags: ['completed'],
        },
      ];

      await Task.insertMany(taskData);
    });

    it('should get all tasks for admin', async () => {
      const response = await request(app)
        .get('/api/tasks')
        .set('Authorization', `Bearer ${adminToken}`)
        .expect(200);

      expect(response.body.success).toBe(true);
      expect(response.body.data).toHaveLength(3);
      expect(response.body.count).toBe(3);
    });

    it('should get only assigned tasks for member', async () => {
      const response = await request(app)
        .get('/api/tasks')
        .set('Authorization', `Bearer ${memberToken}`)
        .expect(200);

      expect(response.body.success).toBe(true);
      expect(response.body.data).toHaveLength(3);
      expect(response.body.count).toBe(3);
    });

    it('should filter tasks by status', async () => {
      const response = await request(app)
        .get('/api/tasks?status=todo')
        .set('Authorization', `Bearer ${adminToken}`)
        .expect(200);

      expect(response.body.success).toBe(true);
      expect(response.body.data).toHaveLength(1);
      expect(response.body.data[0].status).toBe('todo');
    });

    it('should filter tasks by priority', async () => {
      const response = await request(app)
        .get('/api/tasks?priority=high')
        .set('Authorization', `Bearer ${adminToken}`)
        .expect(200);

      expect(response.body.success).toBe(true);
      expect(response.body.data).toHaveLength(1);
      expect(response.body.data[0].priority).toBe('high');
    });

    it('should support pagination', async () => {
      const response = await request(app)
        .get('/api/tasks?page=1&limit=2')
        .set('Authorization', `Bearer ${adminToken}`)
        .expect(200);

      expect(response.body.success).toBe(true);
      expect(response.body.data).toHaveLength(2);
      expect(response.body.pagination).toBeDefined();
    });
  });

  describe('GET /api/tasks/:id', () => {
    let taskId;

    beforeEach(async () => {
      const task = await Task.create({
        title: 'Test Task',
        description: 'Test description',
        status: 'todo',
        priority: 'medium',
        dueDate: new Date(Date.now() + 7 * 24 * 60 * 60 * 1000),
        assignee: memberUser.id,
        createdBy: adminUser.id,
      });

      taskId = task._id;
    });

    it('should get a single task by id', async () => {
      const response = await request(app)
        .get(`/api/tasks/${taskId}`)
        .set('Authorization', `Bearer ${adminToken}`)
        .expect(200);

      expect(response.body.success).toBe(true);
      expect(response.body.data._id).toBe(taskId.toString());
      expect(response.body.data.title).toBe('Test Task');
    });

    it('should return 404 for non-existent task', async () => {
      const fakeId = new mongoose.Types.ObjectId();
      const response = await request(app)
        .get(`/api/tasks/${fakeId}`)
        .set('Authorization', `Bearer ${adminToken}`)
        .expect(404);

      expect(response.body.success).toBe(false);
      expect(response.body.message).toContain('not found');
    });
  });

  describe('PUT /api/tasks/:id', () => {
    let taskId;

    beforeEach(async () => {
      const task = await Task.create({
        title: 'Test Task',
        description: 'Test description',
        status: 'todo',
        priority: 'medium',
        dueDate: new Date(Date.now() + 7 * 24 * 60 * 60 * 1000),
        assignee: memberUser.id,
        createdBy: adminUser.id,
      });

      taskId = task._id;
    });

    it('should update a task successfully', async () => {
      const updateData = {
        title: 'Updated Task',
        status: 'in-progress',
        priority: 'high',
      };

      const response = await request(app)
        .put(`/api/tasks/${taskId}`)
        .set('Authorization', `Bearer ${adminToken}`)
        .send(updateData)
        .expect(200);

      expect(response.body.success).toBe(true);
      expect(response.body.data.title).toBe(updateData.title);
      expect(response.body.data.status).toBe(updateData.status);
      expect(response.body.data.priority).toBe(updateData.priority);
    });

    it('should not allow member to update task assigned to another user', async () => {
      // Create another member user
      const anotherMember = await User.create({
        name: 'Another Member',
        email: 'another@example.com',
        password: 'password123',
        role: 'member',
      });

      const anotherMemberToken = (await request(app)
        .post('/api/auth/login')
        .send({
          email: 'another@example.com',
          password: 'password123',
        })).body.token;

      const updateData = {
        title: 'Updated Task',
      };

      const response = await request(app)
        .put(`/api/tasks/${taskId}`)
        .set('Authorization', `Bearer ${anotherMemberToken}`)
        .send(updateData)
        .expect(403);

      expect(response.body.success).toBe(false);
      expect(response.body.message).toContain('Not authorized');
    });
  });

  describe('DELETE /api/tasks/:id', () => {
    let taskId;

    beforeEach(async () => {
      const task = await Task.create({
        title: 'Test Task',
        description: 'Test description',
        status: 'todo',
        priority: 'medium',
        dueDate: new Date(Date.now() + 7 * 24 * 60 * 60 * 1000),
        assignee: memberUser.id,
        createdBy: adminUser.id,
      });

      taskId = task._id;
    });

    it('should delete a task successfully', async () => {
      const response = await request(app)
        .delete(`/api/tasks/${taskId}`)
        .set('Authorization', `Bearer ${adminToken}`)
        .expect(200);

      expect(response.body.success).toBe(true);
      expect(response.body.message).toContain('deleted successfully');

      // Verify task is deleted
      const deletedTask = await Task.findById(taskId);
      expect(deletedTask).toBeNull();
    });

    it('should not allow member to delete task assigned to another user', async () => {
      // Create another member user
      const anotherMember = await User.create({
        name: 'Another Member',
        email: 'another@example.com',
        password: 'password123',
        role: 'member',
      });

      const anotherMemberToken = (await request(app)
        .post('/api/auth/login')
        .send({
          email: 'another@example.com',
          password: 'password123',
        })).body.token;

      const response = await request(app)
        .delete(`/api/tasks/${taskId}`)
        .set('Authorization', `Bearer ${anotherMemberToken}`)
        .expect(403);

      expect(response.body.success).toBe(false);
      expect(response.body.message).toContain('Not authorized');
    });
  });
});
