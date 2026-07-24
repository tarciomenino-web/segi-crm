import { PrismaClient } from '@prisma/client';
import * as bcrypt from 'bcrypt';

const prisma = new PrismaClient();

async function main() {
  console.log('🌱 Starting database seed...');

  // Create default organization
  const organization = await prisma.organization.create({
    data: {
      name: 'SEGi CRM - Organização Padrão',
      slug: 'segi-default',
      website: 'https://segi-crm.com',
      emailContact: 'contato@segi.com.br',
      phoneContact: '+5521987654321',
      countryCode: 'BR',
      timezone: 'America/Sao_Paulo',
    },
  });
  console.log('✅ Organization created:', organization.id);

  // Create default unit
  const unit = await prisma.unit.create({
    data: {
      organizationId: organization.id,
      code: 'UNIT',
      name: 'Unidade Principal',
      slug: 'unidade-principal',
      address: 'Rua das Flores, 123',
      city: 'Rio de Janeiro',
      state: 'RJ',
      postalCode: '20000-000',
      phone: '+5521987654321',
      email: 'unidade@segi.com.br',
      openingTime: '09:00',
      closingTime: '18:00',
      isActive: true,
    },
  });
  console.log('✅ Unit created:', unit.id);

  // Create default roles
  const adminRole = await prisma.role.create({
    data: {
      organizationId: organization.id,
      name: 'Administrador',
      description: 'Acesso total ao sistema',
      isSystem: true,
    },
  });

  const sdRole = await prisma.role.create({
    data: {
      organizationId: organization.id,
      name: 'SDR',
      description: 'Vendedor - Qualificação de leads',
      isSystem: true,
    },
  });

  const managerRole = await prisma.role.create({
    data: {
      organizationId: organization.id,
      name: 'Gerente',
      description: 'Gestor de equipe',
      isSystem: true,
    },
  });

  console.log('✅ Roles created');

  // Create default admin user
  const passwordHash = await bcrypt.hash('Admin123!@#', 10);

  const adminUser = await prisma.user.create({
    data: {
      organizationId: organization.id,
      email: 'admin@segi.com.br',
      fullName: 'Administrador do Sistema',
      passwordHash,
      isActive: true,
      preferredUnitId: unit.id,
      userRoles: {
        create: {
          roleId: adminRole.id,
          unitId: unit.id,
        },
      },
    },
  });
  console.log('✅ Admin user created:', adminUser.email);

  // Create default test SDR users
  const sdrUser1 = await prisma.user.create({
    data: {
      organizationId: organization.id,
      email: 'sdr1@segi.com.br',
      fullName: 'João da Silva',
      phone: '+5521987654321',
      passwordHash: await bcrypt.hash('Sdr123!@#', 10),
      isActive: true,
      preferredUnitId: unit.id,
      userRoles: {
        create: {
          roleId: sdRole.id,
          unitId: unit.id,
        },
      },
    },
  });

  const sdrUser2 = await prisma.user.create({
    data: {
      organizationId: organization.id,
      email: 'sdr2@segi.com.br',
      fullName: 'Maria dos Santos',
      phone: '+5521987654322',
      passwordHash: await bcrypt.hash('Sdr123!@#', 10),
      isActive: true,
      preferredUnitId: unit.id,
      userRoles: {
        create: {
          roleId: sdRole.id,
          unitId: unit.id,
        },
      },
    },
  });

  const managerUser = await prisma.user.create({
    data: {
      organizationId: organization.id,
      email: 'manager@segi.com.br',
      fullName: 'Carlos Gerente',
      phone: '+5521987654323',
      passwordHash: await bcrypt.hash('Manager123!@#', 10),
      isActive: true,
      preferredUnitId: unit.id,
      userRoles: {
        create: {
          roleId: managerRole.id,
          unitId: unit.id,
        },
      },
    },
  });

  console.log('✅ SDR users created');

  // Create default lead source
  const leadSource = await prisma.leadSource.create({
    data: {
      organizationId: organization.id,
      code: 'META',
      name: 'Meta Lead Ads',
      channel: 'facebook',
    },
  });

  console.log('✅ Lead source created');

  // Create sample leads
  const leads = await Promise.all([
    prisma.lead.create({
      data: {
        organizationId: organization.id,
        unitId: unit.id,
        fullName: 'Lucas Oliveira',
        email: 'lucas@example.com',
        phoneE164: '+5521987654324',
        phoneRaw: '(21) 98765-4324',
        city: 'Rio de Janeiro',
        state: 'RJ',
        leadTemperature: 'HOT',
        leadScore: 65,
        sourceId: leadSource.id,
        channel: 'facebook',
        createdBy: adminUser.id,
        updatedBy: adminUser.id,
      },
    }),
    prisma.lead.create({
      data: {
        organizationId: organization.id,
        unitId: unit.id,
        fullName: 'Ana Costa',
        email: 'ana@example.com',
        phoneE164: '+5521987654325',
        phoneRaw: '(21) 98765-4325',
        city: 'Rio de Janeiro',
        state: 'RJ',
        leadTemperature: 'WARM',
        leadScore: 45,
        sourceId: leadSource.id,
        channel: 'facebook',
        createdBy: adminUser.id,
        updatedBy: adminUser.id,
      },
    }),
    prisma.lead.create({
      data: {
        organizationId: organization.id,
        unitId: unit.id,
        fullName: 'Pedro Martins',
        email: 'pedro@example.com',
        phoneE164: '+5521987654326',
        phoneRaw: '(21) 98765-4326',
        city: 'Rio de Janeiro',
        state: 'RJ',
        leadTemperature: 'COLD',
        leadScore: 20,
        sourceId: leadSource.id,
        channel: 'facebook',
        createdBy: adminUser.id,
        updatedBy: adminUser.id,
      },
    }),
  ]);

  console.log('✅ Sample leads created');

  // Create default pipeline
  const pipeline = await prisma.pipeline.create({
    data: {
      organizationId: organization.id,
      name: 'Pipeline Padrão',
      code: 'DEFAULT',
      isDefault: true,
      stages: {
        create: [
          {
            name: 'Lead',
            order: 0,
            probabilityWin: 0,
            description: 'Lead recém criado',
          },
          {
            name: 'Contatado',
            order: 1,
            probabilityWin: 20,
            description: 'Primeiro contato realizado',
          },
          {
            name: 'Qualificado',
            order: 2,
            probabilityWin: 40,
            description: 'Lead qualificado',
          },
          {
            name: 'Proposta',
            order: 3,
            probabilityWin: 60,
            description: 'Proposta enviada',
          },
          {
            name: 'Negociação',
            order: 4,
            probabilityWin: 80,
            description: 'Em negociação',
          },
          {
            name: 'Fechado - Ganho',
            order: 5,
            probabilityWin: 100,
            isFinalStage: true,
            description: 'Oportunidade fechada com sucesso',
          },
          {
            name: 'Fechado - Perdido',
            order: 6,
            probabilityWin: 0,
            isLostStage: true,
            description: 'Oportunidade perdida',
          },
        ],
      },
    },
  });

  console.log('✅ Default pipeline created');

  // Create sample opportunities
  const stages = await prisma.pipelineStage.findMany({
    where: { pipelineId: pipeline.id },
  });

  await Promise.all([
    prisma.opportunity.create({
      data: {
        organizationId: organization.id,
        unitId: unit.id,
        leadId: leads[0].id,
        pipelineId: pipeline.id,
        stageId: stages[2].id,
        estimatedValue: 5000.0,
        probability: 50,
        temperature: 'HOT',
        sdrId: sdrUser1.id,
        createdBy: adminUser.id,
        updatedBy: adminUser.id,
      },
    }),
    prisma.opportunity.create({
      data: {
        organizationId: organization.id,
        unitId: unit.id,
        leadId: leads[1].id,
        pipelineId: pipeline.id,
        stageId: stages[1].id,
        estimatedValue: 3000.0,
        probability: 30,
        temperature: 'WARM',
        sdrId: sdrUser2.id,
        createdBy: adminUser.id,
        updatedBy: adminUser.id,
      },
    }),
  ]);

  console.log('✅ Sample opportunities created');

  // Create sample courses
  const course = await prisma.course.create({
    data: {
      organizationId: organization.id,
      name: 'Gastronomia Básica',
      description: 'Curso básico de gastronomia',
      durationHours: 40,
      isActive: true,
    },
  });

  console.log('✅ Sample course created');

  // Create journey type
  const journeyType = await prisma.journeyType.create({
    data: {
      organizationId: organization.id,
      name: 'Webinar Gratuito',
      description: 'Webinar de introdução aos cursos',
      durationMinutes: 60,
    },
  });

  console.log('✅ Journey type created');

  console.log('🎉 Database seed completed successfully!');
  console.log('\n📝 Default Credentials:');
  console.log('   Email: admin@segi.com.br');
  console.log('   Password: Admin123!@#');
  console.log('\n📊 Sample Data Created:');
  console.log(`   Organization: ${organization.slug}`);
  console.log(`   Unit: ${unit.code}`);
  console.log(`   Users: Admin + 3 SDRs + 1 Manager`);
  console.log(`   Leads: 3 samples`);
  console.log(`   Opportunities: 2 samples`);
  console.log(`   Pipeline: Default with 7 stages`);
}

main()
  .catch((e) => {
    console.error('❌ Seed error:', e);
    process.exit(1);
  })
  .finally(async () => {
    await prisma.$disconnect();
  });
