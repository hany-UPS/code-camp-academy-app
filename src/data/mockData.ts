
export interface Course {
  id: string;
  title: string;
  description: string;
  thumbnail: string;
  sessions: Session[];
  createdAt: string;
  updatedAt: string;
}

export interface Session {
  id: string;
  title: string;
  description: string;
  videoUrl: string; // YouTube URL
  order: number;
}

export interface Student {
  id: string;
  name: string;
  email: string;
  phone: string;
  assignedCourses: string[];
  progress: {
    courseId: string;
    sessionsCompleted: string[];
  }[];
}

export const mockCourses: Course[] = [
  {
    id: "1",
    title: "Scratch Programming for Beginners",
    description: "Learn the basics of programming with Scratch - perfect for young beginners!",
    thumbnail: "https://images.unsplash.com/photo-1700397870146-a8a9fb1bf666?q=80&w=400&auto=format&fit=crop",
    sessions: [
      {
        id: "1-1",
        title: "Introduction to Scratch",
        description: "Getting started with the Scratch interface",
        videoUrl: "https://www.youtube.com/embed/K0T7zuxEIgw",
        order: 1,
      },
      {
        id: "1-2",
        title: "Creating Your First Game",
        description: "Make a simple game with Scratch",
        videoUrl: "https://www.youtube.com/embed/1E8opsBP_98",
        order: 2,
      },
      {
        id: "1-3",
        title: "Variables and Conditions",
        description: "Learn about variables and conditional statements",
        videoUrl: "https://www.youtube.com/embed/jQgwEsJISy0",
        order: 3,
      }
    ],
    createdAt: "2023-01-15T12:00:00Z",
    updatedAt: "2023-02-10T14:30:00Z",
  },
  {
    id: "2",
    title: "Python for Kids",
    description: "A fun introduction to Python programming for children aged 10-14",
    thumbnail: "https://images.unsplash.com/photo-1526379095098-d400fd0bf935?q=80&w=400&auto=format&fit=crop",
    sessions: [
      {
        id: "2-1",
        title: "Python Basics",
        description: "Learn about variables, types, and printing",
        videoUrl: "https://www.youtube.com/embed/x7X9w_GIm1s",
        order: 1,
      },
      {
        id: "2-2",
        title: "Making Decisions with If-Else",
        description: "Control the flow of your program with conditions",
        videoUrl: "https://www.youtube.com/embed/AWek49wXGzI",
        order: 2,
      }
    ],
    createdAt: "2023-03-01T09:15:00Z",
    updatedAt: "2023-03-20T16:45:00Z",
  },
  {
    id: "3",
    title: "Game Development with Unity",
    description: "Create your own 2D games using the Unity game engine",
    thumbnail: "https://images.unsplash.com/photo-1553481187-be93c21490a9?q=80&w=400&auto=format&fit=crop",
    sessions: [
      {
        id: "3-1",
        title: "Introduction to Unity",
        description: "Learn the Unity interface and basic concepts",
        videoUrl: "https://www.youtube.com/embed/E6A4WvsDeLE",
        order: 1,
      },
      {
        id: "3-2",
        title: "Creating Your First Character",
        description: "Design and animate a game character",
        videoUrl: "https://www.youtube.com/embed/n0GQL5JgJcY",
        order: 2,
      },
      {
        id: "3-3",
        title: "Adding Physics and Collisions",
        description: "Make your game interactive with physics",
        videoUrl: "https://www.youtube.com/embed/gAB64vfbrhI",
        order: 3,
      }
    ],
    createdAt: "2023-04-10T11:20:00Z",
    updatedAt: "2023-05-05T13:10:00Z",
  }
];

export const mockStudents: Student[] = [
  {
    id: "1",
    name: "Alex Johnson",
    email: "alex@example.com",
    phone: "1234567890",
    assignedCourses: ["1", "2"],
    progress: [
      {
        courseId: "1",
        sessionsCompleted: ["1-1", "1-2"]
      },
      {
        courseId: "2",
        sessionsCompleted: ["2-1"]
      }
    ]
  },
  {
    id: "2",
    name: "Sam Smith",
    email: "sam@example.com",
    phone: "2345678901",
    assignedCourses: ["1", "3"],
    progress: [
      {
        courseId: "1",
        sessionsCompleted: ["1-1"]
      },
      {
        courseId: "3",
        sessionsCompleted: []
      }
    ]
  },
  {
    id: "3",
    name: "Jamie Lee",
    email: "jamie@example.com",
    phone: "3456789012",
    assignedCourses: ["2"],
    progress: [
      {
        courseId: "2",
        sessionsCompleted: ["2-1", "2-2"]
      }
    ]
  },
  {
    id: "4",
    name: "Taylor Morgan",
    email: "taylor@example.com",
    phone: "4567890123",
    assignedCourses: ["1", "2", "3"],
    progress: [
      {
        courseId: "1",
        sessionsCompleted: ["1-1", "1-2", "1-3"]
      },
      {
        courseId: "2",
        sessionsCompleted: ["2-1"]
      },
      {
        courseId: "3",
        sessionsCompleted: ["3-1"]
      }
    ]
  }
];
