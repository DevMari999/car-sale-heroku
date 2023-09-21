
![cars-screenshot-1](https://github.com/DevMari999/cars-platform/assets/135366781/ad1ff520-ac42-4d71-896d-7d298d49e9c4)

https://car-sale-platform-c3fa3b2c4642.herokuapp.com/](https://node-cars-platform-a50b2bbce808.herokuapp.com/)
---
- **administrator email:** john@gmail.com
- **administrator password:** john123
---
- **manager email:** linda@gmail.com
- **manager password:** linda123
---
- **seller premium email:** jake@gmail.com
- **seller premium password:** jake123
---
- **seller regular email:** david@gmail.com
- **seller regular password:** david123
---
- **buyer email:** mark@gmail.com
- **buyer password:** mark123

---

**Main Capabilities**

Users are authenticated by role and account type using JWT stored in browser cookies.

**Users can:**

- Sign up as either a buyer or seller.

**All users:**
- Can send and receive messages.

**Administrator:**
- Can create a manager.
- Can delete ads.
- Can view statistics for each ad.
- Can create ads.

**Manager:**
- Possesses all the functionality of an administrator but cannot create another manager.

**Premium seller:**
- Can create an unlimited number of ads.
- Can view statistics for ads they've created.
- Can delete their own ads.

**Regular seller:**
- Can create only one ad.
- Cannot view statistics.
- Has the option to upgrade to premium.
- Can delete their own ads.

**Buyer:**
- Cannot create ads.
- Can view all ads.
- Can send and receive messages.

**Statistics include:**
- Average price by region and for the entire country.
- Number of ad views broken down by day, week, month, and all time.

**Ads can be created in three currencies:** Dollar, Euro, and Hryvnia.
The currency selected during ad creation will be displayed as the default. All other values will be calculated using the exchange rate API from PrivatBank. Exchange rates are updated daily using CRON.

---

**Description**:

**Car Sales Backend Tech Stack:**

        **Back-End**: Node.js, Express.js
        **Database**: MongoDB
        **Template Engine**: EJS
        **Integration**: Bank's Currency Exchange API
        **Scheduling Tool**: Cron
        **Permission Protection**: JWT (JSON Web Tokens)
        **User Roles**: Admin, Manager, Seller (premium or regular), Buyer

**Express.js at the Heart of Application Logic**:

Express.js, a minimalist web framework for Node.js, empowers the backend, facilitating robust routing, middleware configurations, and streamlined error handling. It seamlessly integrates with the MongoDB database, ensuring efficient data retrieval and storage. The blend of Express.js with Node.js ensures rapid response times, scalability, and a modular approach to backend development.

**Data Integrity with MongoDB**:

By leveraging MongoDB, a leading NoSQL database, the platform ensures data integrity, scalability, and high performance. MongoDB's schema-less architecture is perfect for our diverse user roles and the dynamic nature of car sales data. It enables swift modifications to data structures, accommodating the ever-evolving needs of the car sales industry.

**Data-driven Insights**:

Utilizing the robust capabilities of MongoDB, the backend is adept at generating nuanced statistics that inform both sellers(premium) and administrators/managers. These insights provide a clear snapshot of sales trends and user behaviors. Specifically:

- **Regional Pricing Analysis**: The system displays the average car price segmented by regions, allowing users to understand the price trends in specific areas and make informed decisions based on localized pricing.

- **National Pricing Overview**: Beyond regional insights, a holistic view of the average price across the entire country is presented, offering a broad perspective on the national car pricing landscape.

- **Advertisement Engagement Metrics**: To gauge the effectiveness of car listings, the backend tracks and showcases the number of times an advertisement was viewed. This data is segmented to provide daily, weekly, and monthly views, giving sellers a comprehensive understanding of their advertisement's reach and impact over time.

**Optimized Server-Side Rendering**:

With EJS as its core, the platform ensures efficient server-side rendering, delivering dynamic content tailored to user preferences and interactions. This not only aids in quicker page loads but also boosts the platform's SEO performance.

**Dynamic Currency Updates with CRON**:

In an ever-evolving financial landscape, the backend consistently stays updated with current currency valuations. Integrating with a reputable bank's Currency Exchange API and utilizing Cron for daily updates, the system ensures all prices mirror real-time currency rates, fostering fair pricing and trustworthiness.

**Robust User Role Management**:

Each user has a unique role, and the system diligently recognizes that. From an admin managing the platform's operations, a seller showcasing vehicles, to a buyer hunting for their next purchase, the backend skillfully manages distinct user roles. Combined with detailed permissions, it guarantees users access only the relevant content and features, ensuring data protection and enriched user experiences.

---
