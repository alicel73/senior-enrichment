const faker = require('faker');

const Sequelize = require ('sequelize');
const conn = new Sequelize (process.env.DATABASE_URL || 'postgres://localhost/senior_enrichment_db');

const Campus = conn.define('campus', {
    name: {
        type: Sequelize.STRING,
        validate: {
            notEmpty: true
        }
    },
    imageURL: {
        type: Sequelize.STRING,
        defaultValue: '/images/school.jpeg'
    },
    description: Sequelize.TEXT
})

const Student = conn.define('student', {
    firstName: {
        type: Sequelize.STRING,
        validate: {
            notEmpty: true
        }
    },
    lastName: {
        type: Sequelize.STRING,
        validate: {
            notEmpty: true      
        }
    },
    email: {
        type: Sequelize.STRING,
        validate: {
            notEmpty: true,
            isEmail: true
        }
    },
    gpa: {
        type: Sequelize.DECIMAL,
        validate: { min: 0.0, max: 4.0 }
    },
}, {
    getterMethods: {
        fullName() {
            return this.firstName + ' ' + this.lastName
        }
    }
})

Student.belongsTo(Campus, { onDelete: 'cascade' });
Campus.hasMany(Student);

const sync = () => {
    return conn.sync({ force: true });
}

const seed = () => {
    return Promise.all([
        Student.create({ 
            firstName: 'Moon',
            lastName: faker.name.lastName(),
            email: faker.internet.email(),
            gpa: 2.0
        }),
        Student.create({ 
            firstName: 'Barry',
            lastName: faker.name.lastName(),
            email: faker.internet.email(),
            gpa: 1.8,
        }),
        Student.create({ 
            firstName: 'Solar',
            lastName: faker.name.lastName(),
            email: faker.internet.email(),
            gpa: 3.2,
        }),
        Student.create({ 
            firstName: 'Lunar',
            lastName: faker.name.lastName(),
            email: faker.internet.email(),
            gpa: 3.8,
        }),
        Student.create({ 
            firstName: 'Satellite',
            lastName: faker.name.lastName(),
            email: faker.internet.email(),
            gpa: 1.5,
        }),
        Student.create({ 
            firstName: 'Eclipse',
            lastName: faker.name.lastName(),
            email: faker.internet.email(),
            gpa: .7,
        }),
        Student.create({ 
            firstName: 'Rings',
            lastName: faker.name.lastName(),
            email: faker.internet.email(),
            gpa: 2.2,
        }),
        Student.create({ 
            firstName: 'Dust',
            lastName: faker.name.lastName(),
            email: faker.internet.email(),
            gpa: 2.5,
        }),
        Campus.create({
            name: 'Mars',
            description: faker.lorem.paragraph()
        }),
        Campus.create({
            name: 'Saturn',
            description: faker.lorem.paragraph()
        }),
        Campus.create({
            name: 'Venus',
            description: faker.lorem.paragraph()
        }),
    ])
    .then(([ Moon, Barry, Solar, Satellite, Lunar, Eclipse, Rings, Dust, Mars, Saturn, Venus ])=> {
        return Promise.all([
            Moon.setCampus(Mars),
            Barry.setCampus(Saturn),
            Solar.setCampus(Venus),
            Satellite.setCampus(Mars),
            Lunar.setCampus(Saturn),
            Eclipse.setCampus(Venus),
            Rings.setCampus(Mars),
            Dust.setCampus(Saturn)
        ])
    })
}

module.exports = {
    sync,
    seed,
    models: {
        Student,
        Campus
    }
}