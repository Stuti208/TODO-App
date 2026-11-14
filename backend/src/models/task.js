import mongoose from'mongoose';

const taskSchema = new mongoose.Schema({
    title: {
      type: String,
      required: [true, 'Title is required'],
      trim: true,
    },
    description: {
      type: String,
      trim: true,
	},
	date: {
      type: Date,
      required: [true, "Task date is required"]
    },
    startAt: {
      type: Date,
      required: [true, 'start time is required'],
    },
    endAt: {
      type: Date,
    },
    priority: {
      type: String,
      enum: ['low', 'medium', 'high'],
      default: 'low',
    },
    isCompleted: {
      type: Boolean,
      required: true,
      default: false,
    },
    createdAt: {
      type: Date,
      required: true,
      default: Date.now,
    },
    updatedAt: {
      type: Date,
    },
  },
  {
    timestamps: true,
  }
);

taskSchema.index({ date: 1 });

taskSchema.pre('validate', async function () {
  if (this.startAt && this.endAt && this.endAt <= this.startAt) {
    this.invalidate('endAt', 'End time of task should be greater than start time');
  }
});

const Taskmodel = mongoose.model('Task', taskSchema);
export default Taskmodel;
