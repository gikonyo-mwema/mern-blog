📚 COURSE MANAGEMENT



✅ 2. Functional Requirements Breakdown:
A. Admin Dashboard

    Add/Edit/Delete courses (title, description, video/link, PDF, etc.)

    See list of users and their payment status

B. User Side

    See available (but locked) courses

    Click "Enroll" → Redirect to MPesa checkout

    Once paid, unlock access to course content

    Optionally: auto-confirm payment OR admin manually approves


🔒 5. Access Control Logic

    On frontend (React):

        Courses page lists all 3 courses

        "Enroll" button triggers payment

        After successful payment (webhook or manual update), course is unlocked

    On backend (Node.js):

        Protect /api/courses/:id/content using auth middleware

        Check if user has paid


🖥️ 6. Admin Interface

Allow the client (or their staff) to:

    Login as admin

    View all courses

    Add new courses (basic form with title, description, video or file upload)

    Edit/delete existing courses

    See users + their payment status


✅ Database Design

Create Course model (title, price, icon, etc.)

Create Module model (video URL, PDF, etc.)

Link modules to course

    Add support for optional: quizzes, resources, live Q&A links

✅ Admin Dashboard (React)

Create admin-only panel with sidebar

Build UI for:

Create/Edit Course

Upload course icon

Add/Edit Modules

Upload video & PDFs

    Add objectives, resource links

Add drag-to-reorder modules (optional)

Add delete/archive module functionality


🟠 2. PESAPAL
✅ Why Pesapal?

    One of the oldest and most used gateways in Kenya

    MPesa support without a paybill

    They offer “Pay to Phone” capabilities — payouts to personal numbers

🧰 Features:

    Supports MPesa, Airtel Money, Visa, Mastercard

    APIs for:

        Initiating payments

        Receiving IPNs (webhooks)

        Querying payment status

    Allows payout to phone

🔧 Setup
Step 1: Sign up on https://developer.pesapal.com

    Create sandbox and live app

    You’ll get consumer_key and consumer_secret

Step 2: Use REST API

Pesapal uses OAuth1.0a, slightly more complex than Flutterwave.

    Initiate payment request

    User is redirected to Pesapal hosted page

    Upon success, your callback URL is triggered

IPN (Webhook) Structure

They send an IPN to your server when payment is done:

    Confirm with /QueryPaymentStatus endpoint

    You then unlock course for the user

    🧠 Pesapal doesn’t push as fast as Flutterwave, so it's a bit less developer-friendly but still very reliable.



🛠️ 2. Approaches to Video Storage
✅ Option 1: Use Cloud Storage + Embedded Player (Recommended)

Use cases: Simple, secure streaming, low cost
Best tools:

    Cloudinary (free tier + direct video upload support)

    Vimeo (free/cheap tiers, private links)

    Bunny.net (cheap CDN and video hosting)

    Amazon S3 (flexible, scalable, but requires more setup)

🟩 Best balance for devs in Kenya: Cloudinary + MP4 player
✅ Cloudinary (Free for small projects)
🔹 Why?

    Supports video upload, streaming, transformations

    Free plan: 25 GB bandwidth / 300,000 transformations / 10 GB storage

    Supports signed URLs (restrict access to videos)

    Easy to integrate with React + Node.js

🧰 How it works:
🔸 1. Upload Videos

Client uploads videos through the admin dashboard (React)

    Video is sent to backend (Node.js)

    Backend uploads to Cloudinary using SDK

npm install cloudinary

// cloudinaryConfig.js
const cloudinary = require('cloudinary').v2;
cloudinary.config({
  cloud_name: process.env.CLOUD_NAME,
  api_key: process.env.CLOUD_API_KEY,
  api_secret: process.env.CLOUD_SECRET
});

module.exports = cloudinary;

// uploadVideo.js
const cloudinary = require('./cloudinaryConfig');

const uploadVideo = async (req, res) => {
  const file = req.file.path; // Assuming you're using multer
  const result = await cloudinary.uploader.upload(file, {
    resource_type: "video",
    folder: "courses"
  });

  // Save video URL in MongoDB linked to the course
  res.json({ url: result.secure_url });
};

🔸 2. Restrict Access to Videos

By default, Cloudinary URLs are public, but you can:

    Use signed URLs (only valid for X minutes)

    Or store video metadata in DB and only expose the link to authenticated users

In React frontend:

{userHasAccess && (
  <video controls width="100%">
    <source src={videoUrl} type="video/mp4" />
  </video>
)}


💡 1. MODULE STRUCTURE: What does each module contain?

Here’s a realistic, scalable module structure for an environmental course like "EIA Headstart":
📦 Module Contents:
Content Type	Description
🖼️ Title	Name of the module ("Module 1: Introduction to EIA")
🎥 Video	Link to Cloudinary video
📄 PDF	Link to Cloudinary (or other) PDF
💬 Discussion/Chat	Optional (could be: WhatsApp link, group chat link, or internal chat if custom built)
📌 Objectives	Short bullet points about what this module covers
✅ Quiz (optional)	A few assessment questions
📎 Resources	Extra links (government docs, references)
📆 Live Q&A Link	Optional link to Zoom or Calendly for mentorship

    You don’t have to build all this at once. Start with video + PDF + title/description + optional resources.

📐 2. DATABASE MODEL
Course Schema (MongoDB)

{
  title: "EIA Headstart",
  description: "A beginner's guide to Environmental Impact Assessment.",
  iconUrl: String,
  price: Number,
  modules: [ObjectId], // references Module documents
  createdAt: Date
}

Module Schema

{
  title: "Module 1: Introduction",
  videoUrl: String,
  pdfUrl: String,
  objectives: [String],
  discussionLink: String, // e.g., WhatsApp group or internal chat ID
  quiz: [{ question: String, options: [String], correctAnswer: String }],
  resources: [String], // list of URLs
  liveSessionLink: String,
  course: ObjectId,
  order: Number
}

🛠️ 3. FILE STORAGE (PDFs, Videos)
📄 PDF Upload:

    Handled the same way as videos — via Cloudinary or Firebase Storage

    Cloudinary stores PDFs as resource_type: "raw"

    Example:

const result = await cloudinary.uploader.upload(filePath, {
  resource_type: "raw",
  folder: "course_pdfs"
});

    Save the secure_url in the module’s pdfUrl field.

🧑‍💼 4. ADMIN PANEL — UI STRUCTURE

Let’s map out what the Admin Panel should look like and include:
🧱 Main Sections
1. Dashboard Home

    Show list of all courses

    Add New Course button

➕ 2. Create Course Page
Fields:
Field	Type
Course Title	Input text
Description	Textarea
Price (KES)	Number
Icon/Image	File upload
Number of Modules	Auto-filled or set manually

    After creating the course, redirect to Manage Modules page

🧩 3. Add/Edit Module Page

For each module under a course:
Field	Input Type
Module Title	Input text
Video Upload	File input (uploads to Cloudinary)
PDF Upload	File input (uploads to Cloudinary)
Objectives	List inputs or rich text
Discussion Link	URL input
Quiz (optional)	Add question/answers form
Additional Resources	List of URLs
Live Session Link	Optional (Zoom, Google Meet)
Order / Sequence	Number (for sorting)

📌 Add “+ Add Module” button to keep adding multiple modules to a course.
🧑‍🎓 5. Admin Flow (UX)

    Create Course

    Upload Icon, Description, Price

    Add Modules one by one:

        Upload video + PDF

        Enter module title, objectives, links

    Publish Course ✅

🖼️ Suggested UI Layouts
🖼️ Admin Panel Home

+-----------------------------+
| Courses                    |
+-----------------------------+
| 1. EIA Headstart            |
|    [Edit Course] [View]     |
|                             |
| 2. Waste Management 101     |
|    [Edit Course] [View]     |
+-----------------------------+
[+ Create New Course]

🧾 Create/Edit Course Page

[Course Title      ] ____________
[Description       ] ____________
[Course Price (KES)] ____________
[Upload Icon/Image ] [Choose File]
[Submit/Create]

📚 Add Module to Course

[Module Title         ] ____________
[Upload Video         ] [Choose File]
[Upload PDF           ] [Choose File]
[Module Objectives    ]
 - [ ______________ ]
 - [ ______________ ]
[Discussion Group URL ] https://chat.whatsapp.com/xxxxx
[Live Session URL     ] https://meet.google.com/xxxx
[Add Quiz Questions] [+]
[Additional Resources]
 - [ ______________ ]
[Save Module]

    You can use collapsible UI or tabs per module when editing multiple modules.