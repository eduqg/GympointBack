import * as Yup from 'yup';

export default async (req, res, next) => {
  try {
    const schema = Yup.object().shape({
      start_date: Yup.date().required(),
      end_date: Yup.date(),
      price: Yup.number(),
      student_id: Yup.number().required(),
      plan_id: Yup.number().required(),
    });

    await schema.validate(req.body, { abortEarly: false });

    return next();
  } catch (error) {
    return res
      .status(400)
      .json({ error: 'Validation Fails.', messages: error.inner });
  }
};
