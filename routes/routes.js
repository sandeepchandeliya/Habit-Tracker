const router = require('express').Router();
const Habit = require('../models/model');

// Get Habits From Database
router.get('/', async (req, resp) => {
    try {
        const habits = await Habit.find().select('-updatedAt -createdAt -__v').sort({ _id: -1 });
        
        const days = Array.from({ length: 7 }, (_, i) => getFormattedDateAndDay(i));

        resp.render('habit', { habit: habits, days });
    } catch (err) {
        console.error(err);
        resp.status(500).send('Internal Server Error');
    }
});

// Helper function to get formatted date and day
function getFormattedDateAndDay(n) {
    const d = new Date();
    d.setDate(d.getDate() + n);
    const newDate = d.toLocaleDateString('pt-br').split('/').reverse().join('-');
    const days = ['Sun', 'Mon', 'Tue', 'Wed', 'Thu', 'Fri', 'Sat'];
    const day = days[d.getDay()];
    return { date: newDate, day };
}
// Add New Habit
router.post('/habit', async (req, resp) => {
    try {
        const { content } = req.body;

        let habit = await Habit.findOne({ content: content });

        if (habit) {
            const tzoffset = (new Date()).getTimezoneOffset() * 60000;
            const today = (new Date(Date.now() - tzoffset)).toISOString().slice(0, 10);

            const existingDate = habit.dates.find(item => item.date === today);

            if (existingDate) {
                console.log('Habit already inserted in Database');
                return resp.redirect('back');
            } else {
                habit.dates.push({ date: today, complete: 'none' });
                await habit.save();
            }
        } else {
            const tzoffset = (new Date()).getTimezoneOffset() * 60000;
            const localISOTime = (new Date(Date.now() - tzoffset)).toISOString().slice(0, 10);

            const newHabit = new Habit({
                content,
                dates: [{ date: localISOTime, complete: 'none' }]
            });

            await newHabit.save();
        }

        resp.redirect('back');
    } catch (err) {
        console.error(err);
        resp.status(500).send('Internal Server Error');
    }
});

// Update Habit Status
router.get('/habitStatus', async (req, resp) => {
    try {
        const { date: d, id } = req.query;

        const habit = await Habit.findById(id);

        if (!habit) {
            return resp.status(404).send('Habit not found');
        }

        const dateIndex = habit.dates.findIndex(item => item.date === d);

        if (dateIndex !== -1) {
            switch (habit.dates[dateIndex].complete) {
                case 'yes':
                    habit.dates[dateIndex].complete = 'no';
                    break;
                case 'no':
                    habit.dates[dateIndex].complete = 'none';
                    break;
                case 'none':
                    habit.dates[dateIndex].complete = 'yes';
                    break;
            }
        } else {
            habit.dates.push({ date: d, complete: 'yes' });
        }

        await habit.save();
        resp.redirect('back');
    } catch (err) {
        console.error('Habit status not updated', err);
        resp.status(500).send('Error updating habit status');
    }
});

// Delete Habit
router.get('/:id', async (req, resp) => {
    try {
        const habit = await Habit.findOneAndDelete({ _id: req.params.id });
        if (!habit) {
            return resp.status(404).send('Habit not found');
        }
        resp.redirect('/');
    } catch (err) {
        console.error(err);
        resp.status(500).send('Internal Server Error');
    }
});

module.exports = router;
