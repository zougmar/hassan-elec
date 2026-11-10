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
const Service = (await import('../models/Service.js')).default;
const Project = (await import('../models/Project.js')).default;

const defaultServices = [
  {
    title: {
      en: 'Complete Home Electrical Installation',
      fr: 'Installation électrique complète',
      ar: 'تركيب كهربائي منزلي كامل'
    },
    description: {
      en: 'Full wiring, distribution boards, and safe power distribution for new and renovated homes.',
      fr: 'Câblage complet, tableaux électriques et distribution sécurisée pour maisons neuves ou rénovées.',
      ar: 'تمديدات كاملة ولوحات توزيع وتوزيع طاقة آمن للمنازل الجديدة والمجددة.'
    },
    image: 'https://images.unsplash.com/photo-1621905251189-08b45d6a269e?auto=format&fit=crop&w=1200&q=80',
    order: 1
  },
  {
    title: {
      en: 'CCTV & Security Cameras',
      fr: 'Vidéosurveillance & caméras',
      ar: 'كاميرات مراقبة وأمن'
    },
    description: {
      en: 'Professional camera installation with clear coverage for homes and businesses.',
      fr: 'Installation professionnelle de caméras avec couverture claire pour maisons et commerces.',
      ar: 'تركيب كاميرات احترافي بتغطية واضحة للمنازل والشركات.'
    },
    image: 'https://images.unsplash.com/photo-1558002038-1055907df827?auto=format&fit=crop&w=1200&q=80',
    order: 2
  },
  {
    title: {
      en: 'Intercom Systems',
      fr: 'Systèmes d\'interphone',
      ar: 'أنظمة الإنتركوم'
    },
    description: {
      en: 'Modern audio and video intercoms for buildings, offices, and residential complexes.',
      fr: 'Interphones audio et vidéo modernes pour immeubles, bureaux et résidences.',
      ar: 'إنتركوم صوت وصورة حديث للمباني والمكاتب والمجمعات السكنية.'
    },
    image: 'https://images.unsplash.com/photo-1581092918056-0c4c3acd3789?auto=format&fit=crop&w=1200&q=80',
    order: 3
  },
  {
    title: {
      en: 'Lighting Design & Installation',
      fr: 'Conception et installation d\'éclairage',
      ar: 'تصميم وتركيب الإضاءة'
    },
    description: {
      en: 'Indoor and outdoor lighting solutions that improve safety, ambiance, and efficiency.',
      fr: 'Solutions d\'éclairage intérieur et extérieur pour plus de sécurité, d\'ambiance et d\'efficacité.',
      ar: 'حلول إضاءة داخلية وخارجية لتحسين الأمان والأجواء والكفاءة.'
    },
    image: 'https://images.unsplash.com/photo-1565814329452-e1efa11c5b89?auto=format&fit=crop&w=1200&q=80',
    order: 4
  },
  {
    title: {
      en: 'Electrical Maintenance & Repairs',
      fr: 'Maintenance et réparations électriques',
      ar: 'صيانة وإصلاحات كهربائية'
    },
    description: {
      en: 'Fast diagnostics and reliable repairs for faults, upgrades, and emergency callouts.',
      fr: 'Diagnostic rapide et réparations fiables pour pannes, mises à niveau et urgences.',
      ar: 'تشخيص سريع وإصلاحات موثوقة للأعطال والترقيات وحالات الطوارئ.'
    },
    image: 'https://images.unsplash.com/photo-1504328345606-18bbc8c9d7d1?auto=format&fit=crop&w=1200&q=80',
    order: 5
  }
];

const defaultProjects = [
  {
    title: {
      en: 'Residential Rewiring Project',
      fr: 'Projet de rénovation électrique résidentielle',
      ar: 'مشروع إعادة تمديد منزلي'
    },
    description: {
      en: 'Complete electrical upgrade for a family home with new panels and safe circuits.',
      fr: 'Mise à niveau électrique complète d\'une maison familiale avec nouveaux tableaux et circuits sécurisés.',
      ar: 'ترقية كهربائية كاملة لمنزل عائلي مع لوحات ودوائر آمنة جديدة.'
    },
    images: [
      'https://images.unsplash.com/photo-1621905252507-b35492cc74b4?auto=format&fit=crop&w=1200&q=80',
      'https://images.unsplash.com/photo-1473341304170-971dccb5ac1e?auto=format&fit=crop&w=1200&q=80'
    ],
    category: 'residential'
  },
  {
    title: {
      en: 'Commercial Office Fit-Out',
      fr: 'Aménagement électrique de bureau',
      ar: 'تجهيز كهربائي لمكتب تجاري'
    },
    description: {
      en: 'Power, lighting, and data-ready infrastructure for a modern workspace.',
      fr: 'Alimentation, éclairage et infrastructure prête pour un espace de travail moderne.',
      ar: 'طاقة وإضاءة وبنية جاهزة لمساحة عمل حديثة.'
    },
    images: [
      'https://images.unsplash.com/photo-1497366216548-37526070297c?auto=format&fit=crop&w=1200&q=80',
      'https://images.unsplash.com/photo-1497366811353-6870744d04b2?auto=format&fit=crop&w=1200&q=80'
    ],
    category: 'commercial'
  },
  {
    title: {
      en: 'Security Camera Network',
      fr: 'Réseau de caméras de sécurité',
      ar: 'شبكة كاميرات أمنية'
    },
    description: {
      en: 'Multi-camera CCTV installation with clear night vision and remote monitoring.',
      fr: 'Installation multi-caméras avec vision nocturne claire et supervision à distance.',
      ar: 'تركيب كاميرات متعددة برؤية ليلية واضحة ومراقبة عن بُعد.'
    },
    images: [
      'https://images.unsplash.com/photo-1557597774-9d273605dfa9?auto=format&fit=crop&w=1200&q=80',
      'https://images.unsplash.com/photo-1557324232-b8917d3c3dcb?auto=format&fit=crop&w=1200&q=80'
    ],
    category: 'security'
  },
  {
    title: {
      en: 'Building Intercom Upgrade',
      fr: 'Modernisation d\'interphone d\'immeuble',
      ar: 'تحديث إنتركوم مبنى'
    },
    description: {
      en: 'Video intercom replacement across shared entrances for safer access control.',
      fr: 'Remplacement d\'interphones vidéo aux entrées communes pour un contrôle d\'accès plus sûr.',
      ar: 'استبدال إنتركوم فيديو عند المداخل المشتركة لتحكم دخول أكثر أمانًا.'
    },
    images: [
      'https://images.unsplash.com/photo-1558002038-1055907df827?auto=format&fit=crop&w=1200&q=80',
      'https://images.unsplash.com/photo-1563986768609-322da13575f3?auto=format&fit=crop&w=1200&q=80'
    ],
    category: 'intercom'
  },
  {
    title: {
      en: 'Outdoor Lighting Installation',
      fr: 'Installation d\'éclairage extérieur',
      ar: 'تركيب إضاءة خارجية'
    },
    description: {
      en: 'Garden and facade lighting designed for ambiance, visibility, and energy efficiency.',
      fr: 'Éclairage de jardin et de façade pensé pour l\'ambiance, la visibilité et l\'efficacité énergétique.',
      ar: 'إضاءة حديقة وواجهة مصممة للأجواء والرؤية وكفاءة الطاقة.'
    },
    images: [
      'https://images.unsplash.com/photo-1513694203232-719a280e022f?auto=format&fit=crop&w=1200&q=80',
      'https://images.unsplash.com/photo-1524484485831-a92ffc0de03f?auto=format&fit=crop&w=1200&q=80'
    ],
    category: 'lighting'
  }
];

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

    // 7. Default services (ensure 5)
    const serviceCount = await Service.countDocuments();
    if (serviceCount < 5) {
      const existingTitles = new Set(
        (await Service.find({}, 'title.en')).map((s) => s.title?.en).filter(Boolean)
      );
      const toCreate = defaultServices.filter((s) => !existingTitles.has(s.title.en)).slice(0, 5 - serviceCount);
      if (toCreate.length) {
        await Service.insertMany(toCreate);
        console.log(`Created ${toCreate.length} default service(s)`);
      }
    } else {
      console.log('Services already seeded (5+)');
    }

    // 8. Default projects (ensure 5)
    const projectCount = await Project.countDocuments();
    if (projectCount < 5) {
      const existingTitles = new Set(
        (await Project.find({}, 'title.en')).map((p) => p.title?.en).filter(Boolean)
      );
      const toCreate = defaultProjects.filter((p) => !existingTitles.has(p.title.en)).slice(0, 5 - projectCount);
      if (toCreate.length) {
        await Project.insertMany(toCreate);
        console.log(`Created ${toCreate.length} default project(s)`);
      }
    } else {
      console.log('Projects already seeded (5+)');
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
