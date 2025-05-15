export const getCourses = async (req, res) => {
    try {
      const { limit = 9, page = 1 } = req.query;
      const skip = (page - 1) * limit;
  
      const courses = await Course.find()
        .skip(skip)
        .limit(parseInt(limit));
  
      const totalCourses = await Course.countDocuments();
  
      const lastMonth = new Date();
      lastMonth.setMonth(lastMonth.getMonth() - 1);
      const lastMonthCourses = await Course.countDocuments({
        createdAt: { $gte: lastMonth }
      });
  
      res.status(200).json({
        courses,
        totalCourses,
        lastMonthCourses
      });
    } catch (error) {
      res.status(500).json({ message: error.message });
    }
  };