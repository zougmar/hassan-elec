/**
 * Seed script for Employee & Admin Management module
 * Creates: Organization, Department, Manager (admin), Manager (manager), Employee, Task
 *
 * Run: node scripts/seed.js
 * Or:  npm run seed
 */
import mongoose from 'mongoose';
import dotenv from 'dotenv';
import path from 'path';
import { fileURLToPath } from 'url';

const __filename = fileURLToPath(import.meta.url);
const __dirname = path.dirname(__filename);

dotenv.config({ path: path.join(__dirname, '..', '.env') });

// Import models after dotenv
const Organization = (await import('../models/Organization.js')).default;
const Department = (await import('../models/Department.js')).default;
const Manager = (await import('../models/Manager.js')).default;
const Employee = (await import('../models/Employee.js')).default;
const Task = (await import('../models/Task.js')).default;

const MONGODB_URI = process.env.MONGODB_URI || 'mongodb://localhost:27017/hassan-elec';

async function seed() {
  try {
    await mongoose.connect(MONGODB_URI);
    console.log('Connected to MongoDB');

    // 1. Organization
    let org = await Organization.findOne({ org_email: 'info@hassan-elec.com' });
    if (!org) {
      org = await Organization.create({
        org_name: 'Hassan Electrician Service',
        org_address: '123 Main Street, City',
        org_email: 'info@hassan-elec.com',
        org_contact: '+1234567890'
      });
      console.log('Created Organization:', org.org_name);
    } else {
      console.log('Organization already exists');
    }

    // 2. Department
    let dept = await Department.findOne({ organization: org._id });
    if (!dept) {
      dept = await Department.create({
        dept_name: 'Operations',
        dept_contact: '+1234567891',
        dept_email: 'ops@hassan-elec.com',
        organization: org._id
      });
      console.log('Created Department:', dept.dept_name);
    } else {
      console.log('Department already exists');
    }

    // 3. Manager (Admin role) - can manage orgs, depts, managers
    let adminManager = await Manager.findOne({ email: 'manager@hassan-elec.com' });
    if (!adminManager) {
      adminManager = await Manager.create({
        name: 'Admin Manager',
        email: 'manager@hassan-elec.com',
        password: 'manager123',
        contact: '+1234567892',
        department: dept._id,
        role: 'admin'
      });
      console.log('Created Admin Manager: manager@hassan-elec.com / manager123');
    } else {
      console.log('Admin Manager already exists');
    }

    // 4. Manager (Manager role) - can create employees and tasks
    let mngr = await Manager.findOne({ email: 'supervisor@hassan-elec.com' });
    if (!mngr) {
      mngr = await Manager.create({
        name: 'Department Supervisor',
        email: 'supervisor@hassan-elec.com',
        password: 'supervisor123',
        contact: '+1234567893',
        department: dept._id,
        role: 'manager'
      });
      console.log('Created Manager: supervisor@hassan-elec.com / supervisor123');
    } else {
      console.log('Manager already exists');
    }

    // 5. Employee
    let emp = await Employee.findOne({ emp_email: 'employee@hassan-elec.com' });
    if (!emp) {
      emp = await Employee.create({
        emp_name: { en: 'John Doe', fr: 'Jean Dupont', ar: 'جون دو' },
        emp_email: 'employee@hassan-elec.com',
        emp_contact: '+1234567894',
        emp_dob: new Date('1990-01-15'),
        department: dept._id,
        manager: mngr._id,
        password: 'employee123'
      });
      console.log('Created Employee: employee@hassan-elec.com / employee123');
    } else {
      console.log('Employee already exists');
    }

    // 6. Sample Task
    const existingTask = await Task.findOne({ employee: emp._id });
    if (!existingTask) {
      await Task.create({
        title: { en: 'Install wiring', fr: 'Installation câblage', ar: 'تثبيت الأسلاك' },
        description: { en: 'Complete wiring for new building', fr: 'Terminer le câblage du nouveau bâtiment', ar: 'إكمال الأسلاك للمبنى الجديد' },
        status: 'pending',
        dueDate: new Date(Date.now() + 7 * 24 * 60 * 60 * 1000),
        employee: emp._id,
        manager: mngr._id
      });
      console.log('Created sample Task');
    } else {
      console.log('Sample task already exists');
    }

    console.log('\n--- Seed completed ---');
    console.log('\nTest credentials:');
    console.log('  Admin/Manager login (admin panel): manager@hassan-elec.com / manager123');
    console.log('  Manager login (admin panel):       supervisor@hassan-elec.com / supervisor123');
    console.log('  Employee login (employee panel):   employee@hassan-elec.com / employee123');
  } catch (err) {
    console.error('Seed error:', err);
    process.exit(1);
  } finally {
    await mongoose.disconnect();
    console.log('Disconnected from MongoDB');
    process.exit(0);
  }
}

seed();
