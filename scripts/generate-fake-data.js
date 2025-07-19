const { faker } = require("@faker-js/faker");
const fs = require("fs");
const path = require("path");

// Set seed for consistent results
faker.seed(123);

function generateUsers(count = 50) {
  const users = [];

  for (let i = 1; i <= count; i++) {
    const user = {
      id: i,
      name: faker.person.fullName(),
      username: faker.internet.username(),
      email: faker.internet.email(),
      address: {
        street: faker.location.streetAddress(),
        suite: faker.helpers.arrayElement([
          `Apt. ${faker.number.int({ min: 100, max: 999 })}`,
          `Suite ${faker.number.int({ min: 100, max: 999 })}`,
          `Floor ${faker.number.int({ min: 1, max: 50 })}`,
        ]),
        city: faker.location.city(),
        zipcode: faker.location.zipCode(),
        geo: {
          lat: faker.location.latitude().toString(),
          lng: faker.location.longitude().toString(),
        },
      },
      phone: faker.phone.number(),
      website: faker.internet.domainName(),
      company: {
        name: faker.company.name(),
        catchPhrase: faker.company.catchPhrase(),
        bs: faker.company.buzzPhrase(),
      },
    };
    users.push(user);
  }

  return users;
}

function generatePosts(users, postsPerUser = 10) {
  const posts = [];
  let postId = 1;
  
  const postTitles = [
    "The Future of Web Development in 2024",
    "Understanding React Server Components",
    "Why TypeScript is Becoming Essential",
    "Building Scalable APIs with Modern Tools",
    "The Rise of Edge Computing",
    "Optimizing Performance in React Applications",
    "Microservices vs Monoliths: A Deep Dive",
    "The Impact of AI on Software Development",
    "Best Practices for Database Design",
    "Security Considerations in Modern Web Apps",
    "Getting Started with Next.js 14",
    "The Evolution of CSS Frameworks",
    "State Management Solutions Compared",
    "Testing Strategies for React Applications",
    "Deployment Strategies for Modern Applications",
    "Understanding GraphQL vs REST",
    "The Importance of Code Quality",
    "Building Accessible Web Applications",
    "Performance Monitoring Best Practices",
    "The Future of JavaScript Frameworks"
  ];
  
  const postBodies = [
    "In today's rapidly evolving tech landscape, developers are constantly seeking new ways to build faster, more efficient applications. The introduction of new frameworks and tools has revolutionized how we approach web development.",
    
    "Modern web development requires a deep understanding of both frontend and backend technologies. Developers must stay up-to-date with the latest trends and best practices to remain competitive in the industry.",
    
    "Performance optimization has become a critical aspect of web development. Users expect fast, responsive applications, and developers must implement various techniques to meet these expectations.",
    
    "Security should always be a top priority when building web applications. From input validation to authentication, every aspect of the application must be designed with security in mind.",
    
    "The rise of cloud computing has transformed how we deploy and scale applications. Understanding cloud platforms and services is essential for modern developers.",
    
    "User experience design plays a crucial role in the success of web applications. Developers must consider accessibility, usability, and performance when designing user interfaces.",
    
    "Database design and optimization are fundamental skills for any developer working with data-driven applications. Choosing the right database and designing efficient schemas can make or break an application.",
    
    "API design is an art that requires careful consideration of usability, performance, and maintainability. Well-designed APIs can significantly improve the developer experience.",
    
    "Testing is not just about finding bugs; it's about building confidence in your code. A comprehensive testing strategy can save time and reduce costs in the long run.",
    
    "Continuous integration and deployment have become standard practices in modern development workflows. Automating the build and deployment process can improve efficiency and reduce errors."
  ];

  users.forEach((user) => {
    for (let i = 0; i < postsPerUser; i++) {
      const post = {
        userId: user.id,
        id: postId++,
        title: faker.helpers.arrayElement(postTitles) + " - " + faker.lorem.words({ min: 2, max: 4 }),
        body: faker.helpers.arrayElement(postBodies) + "\n\n" + faker.lorem.paragraphs({ min: 1, max: 2 }),
      };
      posts.push(post);
    }
  });

  return posts;
}

function generateComments(posts, commentsPerPost = 5) {
  const comments = [];
  let commentId = 1;
  
  const commentBodies = [
    "Great article! This really helped me understand the concepts better. I've been struggling with this topic for a while now.",
    "Thanks for sharing this information. I'm definitely going to implement some of these practices in my next project.",
    "I have a question about the implementation details. Could you elaborate more on the specific steps?",
    "This is exactly what I was looking for. The examples are very clear and easy to follow.",
    "I've been using a different approach, but this seems more efficient. I'll give it a try!",
    "The performance improvements mentioned here are impressive. I'd love to see more benchmarks.",
    "This is a game-changer for my workflow. Thank you for the detailed explanation.",
    "I'm curious about the trade-offs involved. Are there any downsides to consider?",
    "Excellent write-up! I've bookmarked this for future reference.",
    "I've been following this trend and it's definitely the way forward. Great insights!",
    "This approach has worked wonders for my team. Highly recommended!",
    "I'm still learning about this topic, but your explanation made it much clearer.",
    "The code examples are very helpful. I appreciate the practical approach.",
    "I've encountered some issues with this setup. Any troubleshooting tips?",
    "This is a comprehensive guide. I'll be sharing this with my colleagues."
  ];

  posts.forEach((post) => {
    for (let i = 0; i < commentsPerPost; i++) {
      const comment = {
        postId: post.id,
        id: commentId++,
        name: faker.person.fullName(),
        email: faker.internet.email(),
        body: faker.helpers.arrayElement(commentBodies),
      };
      comments.push(comment);
    }
  });

  return comments;
}

function generateFakeData() {
  console.log("Generating fake data...");

  // Generate users first
  const users = generateUsers(50);
  console.log(`Generated ${users.length} users`);

  // Generate posts for each user
  const posts = generatePosts(users, 10);
  console.log(`Generated ${posts.length} posts`);

  // Generate comments for each post
  const comments = generateComments(posts, 5);
  console.log(`Generated ${comments.length} comments`);

  // Create the final data structure
  const fakeData = {
    users,
    posts,
    comments,
  };

  // Write to db.json
  const dbPath = path.join(__dirname, "../apps/0-json-server/db.json");
  fs.writeFileSync(dbPath, JSON.stringify(fakeData, null, 2));

  console.log(`✅ Fake data written to ${dbPath}`);
  console.log(`📊 Summary:`);
  console.log(`   - Users: ${users.length}`);
  console.log(`   - Posts: ${posts.length}`);
  console.log(`   - Comments: ${comments.length}`);
}

// Run the script
generateFakeData();
