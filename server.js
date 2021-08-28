const express = require('express')
const mongoose = require('mongoose')
const { body, validationResult } = require('express-validator')
const exphbs = require('express-handlebars')
require('dotenv').config()

const User = require('./models/user')

const app = express()
app.engine('handlebars', exphbs())
app.set('view engine', 'handlebars')
app.use(express.urlencoded({ extended: true }));

mongoose.connect(`mongodb+srv://sit313:${process.env.MONGODB_PASSWORD}@cluster0.3j7yw.mongodb.net/iService?retryWrites=true&w=majority`, {
    useUnifiedTopology: true,
    useNewUrlParser: true,
})

app.get('/signup', (req, res) => {
    res.render('signup', { layout: false })
})

app.post(
    '/signup',
    body(['first_name', 'last_name', 'street_line_1', 'state', 'city', 'email', 'password', 'country_of_residence'], 'This field is required').not().isEmpty(),
    body('email', 'This field must be a valid email').isEmail(),
    body('password', 'Password must be at least 8 characters long').isLength({ min: 8 }),
    body('password').custom((value, { req }) => {
        if (value !== req.body.password_confirm) {
            throw new Error('Password confirmation does not match password')
        }

        return true
    }),
    body('email').custom(async (value) => {
        if (await User.exists({email: value})) {
            throw new Error('Email is already in use')
        }

        return true;
    }),
    async (req, res) => {
        const errors = validationResult(req)
        if (!errors.isEmpty()) {
            return res.status(422).render('signup', {
                layout: false,
                errors: errors.mapped(),
                old_data: req.body
            })
        }
        try {
            const { first_name, last_name, email, password, country_of_residence, street_line_1, street_line_2, state, postcode, city, phone_number } = req.body

            const user = new User({
                first_name,
                last_name,
                email,
                password,
                country_of_residence,
                phone_number,
                address: {
                    street_line_1,
                    street_line_2,
                    state,
                    postcode,
                    city
                }
            })

            await user.save()

            res.send('User created')
        } catch (e) {
            res.status(500).send(e)
        }
    }
)

const port = 3025
app.listen(port, () => {
    console.log(`app listening at http://localhost:${port}`)
})