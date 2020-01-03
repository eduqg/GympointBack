import faker from 'faker';
import { factory } from 'factory-girl';

import User from '../src/app/models/User';
import Plan from '../src/app/models/Plan';
import Student from '../src/app/models/Student';
import Registration from '../src/app/models/Registration';
import HelpOrder from '../src/app/models/HelpOrder';

factory.define('User', User, {
  name: faker.name.findName(),
  email: faker.internet.email(),
  password: faker.internet.password(),
  admin: false,
});

factory.define('Plan', Plan, {
  title: faker.name.title(),
  duration: faker.random.number(),
  price: faker.finance.amount(),
});

factory.define('Student', Student, {
  name: faker.name.findName(),
  email: faker.internet.email(),
  idade: faker.random.number(),
  peso: faker.finance.amount(),
  altura: faker.finance.amount(),
});

factory.define('Registration', Registration, {
  start_date: new Date(),
  student_id: factory.assoc('Student', 'id'),
  plan_id: factory.assoc('Plan', 'id'),
});

factory.define('HelpOrder', HelpOrder, {
  question: faker.lorem.words(),
  student_id: factory.assoc('Student', 'id'),
});

export default factory;
