import mongoose from 'mongoose';

const postSchema = new mongoose.Schema(
  {
    userId: {
      type: mongoose.Schema.Types.ObjectId,
      ref: 'User',
      required: [true, 'User ID is required'],
    },
    content: {
      type: String,
      required: [true, 'Content is required'],
      minlength: [100, 'Content should be at least 100 characters'],
    },
    title: {
      type: String,
      required: [true, 'Title is required'],
      unique: true,
      trim: true,
      maxlength: [120, 'Title cannot exceed 120 characters'],
    },
    image: {
      type: String,
      required: [true, 'Image URL is required'],
      default: 'https://res.cloudinary.com/dcrubaesi/image/upload/v1745060667/uploads/zsowafnaoebrvrivbca8.jpg',
      validate: {
        validator: function(v) {
          return /^https?:\/\/res\.cloudinary\.com\/.+\/upload\/.+/i.test(v);
        },
        message: props => `${props.value} is not a valid Cloudinary URL`
      }
    },
    category: {
      type: String,
      required: true,
      default: 'uncategorized',
      enum: {
        values: [
          'uncategorized',
          'climate-change',
          'renewable-energy',
          'sustainable-agriculture',
          'conservation',
          'zero-waste',
          'ocean-preservation',
          'green-tech',
          'environmental-policy',
          'sustainable-cities',
          'eco-tourism'
        ],
        message: '{VALUE} is not a valid category'
      }
    },
    slug: {
      type: String,
      required: [true, 'Slug is required'],
      unique: true,
      trim: true,
      match: [/^[a-z0-9-]+$/, 'Slug can only contain lowercase letters, numbers and hyphens']
    },
    views: {
      type: Number,
      default: 0,
      min: 0
    },
    imagePublicId: {
      type: String,
      select: false // Don't return this field by default
    }
  },
  { 
    timestamps: true,
    toJSON: { virtuals: true },
    toObject: { virtuals: true }
  }
);

// Indexes for better query performance
postSchema.index({ title: 'text', content: 'text' });
postSchema.index({ userId: 1 });
postSchema.index({ category: 1 });
postSchema.index({ views: -1 });
postSchema.index({ createdAt: -1 });

// Virtual for reading time
postSchema.virtual('readingTime').get(function() {
  const wordCount = this.content.split(/\s+/).length;
  return Math.ceil(wordCount / 200); // 200 words per minute
});

const Post = mongoose.model('Post', postSchema);

export default Post;
