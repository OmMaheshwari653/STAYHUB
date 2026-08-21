# StayHub

A full-stack accommodation listing platform built with Node.js, Express, MongoDB and EJS. Users can browse stays, create their own listings with photos, and leave reviews.

## Features

- **Listings CRUD** — create, view, edit and delete stays (title, description, price, location, country, image)
- **Authentication** — signup / login / logout via Passport (local strategy) with sessions persisted in MongoDB
- **Authorization** — only a listing's owner can edit or delete it; only a review's author can delete it
- **Reviews & ratings** — 1–5 star reviews per listing, cascade-deleted with their listing
- **Image uploads** — multipart uploads stored on Cloudinary
- **Server-side validation** — Joi schemas for listings and reviews
- **Flash messages** and a shared EJS layout (ejs-mate) for consistent UI

## Tech Stack

| Layer | Tools |
| --- | --- |
| Runtime | Node.js, Express 5 |
| Database | MongoDB Atlas, Mongoose |
| Views | EJS, ejs-mate, method-override |
| Auth | Passport, passport-local, passport-local-mongoose, express-session, connect-mongo |
| Uploads | Multer, multer-storage-cloudinary, Cloudinary |
| Validation | Joi |

## Project Structure

```
app.js              # Express app: middleware, session, passport, routes, error handling
cloudConfig.js      # Cloudinary + multer storage config
joi.js              # Joi validation schemas
middleware.js       # isLoggedIn, isOwner, isReviewAuthor, validators
routes/             # listing.js, review.js, user.js
controllers/        # listings.js, reviews.js, users.js
models/             # listing.js, review.js, user.js
views/              # EJS templates (layouts, includes, listings, users)
public/             # static css & js
init/               # database seed script and sample data
utils/              # wrapAsync, expressError
```

## Getting Started

### Prerequisites

- Node.js 18+
- A MongoDB database (Atlas connection string or local MongoDB)
- A Cloudinary account

### Installation

```bash
git clone <repo-url>
cd stayHub
npm install
```

### Environment Variables

Create a `.env` file in the project root:

```env
ATLAS_DB_URL=your_mongodb_connection_string
SECRET=your_session_secret
CLOUD_NAME=your_cloudinary_cloud_name
CLOUD_API_KEY=your_cloudinary_api_key
CLOUD_API_SECRET=your_cloudinary_api_secret
```

`.env` is only loaded when `NODE_ENV` is not `production` — in production, set these as real environment variables.

### Run

```bash
node app.js
```

The app listens on **http://localhost:3000** and redirects `/` to `/listings`.

### Seed sample data (optional)

`init/index.js` wipes the `listings` collection and inserts the sample data from `init/data.js`. It connects to a local MongoDB (`mongodb://127.0.0.1:27017/wanderlust`) and assigns a hard-coded owner id — update both before running:

```bash
node init/index.js
```

## Routes

### Listings
| Method | Path | Auth | Description |
| --- | --- | --- | --- |
| GET | `/listings` | — | All listings |
| GET | `/listings/new` | login | New listing form |
| POST | `/listings` | login | Create listing (image upload) |
| GET | `/listings/:id` | — | Listing details + reviews |
| GET | `/listings/:id/edit` | owner | Edit form |
| PUT | `/listings/:id` | owner | Update listing |
| DELETE | `/listings/:id` | owner | Delete listing |

### Reviews
| Method | Path | Auth | Description |
| --- | --- | --- | --- |
| POST | `/listings/:id/reviews` | login | Add a review |
| DELETE | `/listings/:id/reviews/:reviewId` | author | Delete a review |

### Users
| Method | Path | Description |
| --- | --- | --- |
| GET | `/signup` | Signup form |
| POST | `/signup` | Register and log in |
| GET | `/login` | Login form |
| POST | `/login` | Authenticate |
| GET | `/logout` | Log out |

## License

ISC — author: Om Maheshwari
