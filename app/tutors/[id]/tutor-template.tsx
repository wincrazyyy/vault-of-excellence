import type { Tutor, Tutor2 } from "@/components/tutors/types";
import type { Section } from "@/lib/sections/types";

export const aboutSection: Section = {
  id: "about",
  modules: [
    {
      type: "rte",
      content: {
        doc: {
          type: "doc",
          content: [
            {
              type: "heading",
              attrs: { level: 2 },
              content: [{ type: "text", text: "About Me" }],
            },
            {
              type: "paragraph",
              content: [
                {
                  type: "text",
                  text: "I help students build strong fundamentals, then move into exam-style questions with a clear method.",
                },
              ],
            },
            {
              type: "heading",
              attrs: { level: 3 },
              content: [{ type: "text", text: "IBDP & A-Level Specialist" }],
            },
            {
              type: "bulletList",
              content: [
                {
                  type: "listItem",
                  content: [
                    {
                      type: "paragraph",
                      content: [
                        {
                          type: "text",
                          text: "10+ years of experience tutoring IBDP & A-Level Math.",
                        },
                      ],
                    },
                  ],
                },
                {
                  type: "listItem",
                  content: [
                    {
                      type: "paragraph",
                      content: [
                        {
                          type: "text",
                          text: "Extensive knowledge of exam formats, common pitfalls, and effective strategies.",
                        },
                      ],
                    },
                  ],
                },
                {
                  type: "listItem",
                  content: [
                    {
                      type: "paragraph",
                      content: [
                        {
                          type: "text",
                          text: "Clear explanations and step-by-step structure",
                        },
                      ],
                    },
                  ],
                },
              ],
            },
            {
              type: "heading",
              attrs: { level: 3 },
              content: [{ type: "text", text: "Lifelong Tutoring Commitment" }],
            },
            {
              type: "bulletList",
              content: [
                {
                  type: "listItem",
                  content: [
                    {
                      type: "paragraph",
                      content: [
                        {
                          type: "text",
                          text: "Dedicated to helping students achieve their academic goals.",
                        },
                      ],
                    },
                  ],
                },
                {
                  type: "listItem",
                  content: [
                    {
                      type: "paragraph",
                      content: [
                        { type: "text", text: "Patient, encouraging, and adaptable teaching style." },
                      ],
                    },
                  ],
                },
                {
                  type: "listItem",
                  content: [
                    {
                      type: "paragraph",
                      content: [
                        { type: "text", text: "Focus on building confidence and problem-solving skills." },
                      ],
                    },
                  ],
                },
              ],
            },
          ],
        },
      },
    },
    {
      type: "grid",
      content: {
        columns: 2,
        gap: "md",
        align: "start",
        items: [
          {
            id: "a",
            placement: { colStart: 1, colSpan: 1 },
            module: {
              type: "miniCard",
              content: {
                title: "Subjects",
                kind: "tags",
                items: ["Math", "Further Math"],
                variant: "violet",
              }
            },
          },
          {
            id: "b",
            placement: { colStart: 2, colSpan: 1 },
            module: {
              type: "miniCard",
              content: {
                title: "Syllabuses",
                kind: "tags",
                items: ["IBDP", "A-levels", "IGCSE"],
                variant: "violet",
              }
            },
          },
        ],
      }
    }
  ],
};

export const backgroundSection: Section = {
  id: "academic-background",
  modules: [
    {
      type: "rte",
      content: {
        doc: {
          type: "doc",
          content: [
            {
              type: "heading",
              attrs: { level: 2 },
              content: [{ type: "text", text: "Academic Background" }],
            },
            {
              type: "bulletList",
              content: [
                {
                  type: "listItem",
                  content: [
                    {
                      type: "paragraph",
                      content: [
                        {
                          type: "text",
                          text: "CityUHK - BBA QFRM (Math Minor), First Class Honours",
                        },
                      ],
                    },
                  ],
                },
                {
                  type: "listItem",
                  content: [
                    {
                      type: "paragraph",
                      content: [
                        {
                          type: "text",
                          text: "High School Education - HK A-Level Examination Pure Mathematics, A (Top 4.8%)",
                        },
                      ],
                    },
                  ],
                },
              ],
            },
          ],
        },
      },
    },
  ],
};

export const teachingSection: Section = {
  id: "teaching-style",
  modules: [
    {
      type: "rte",
      content: {
        doc: {
          type: "doc",
          content: [
            {
              type: "heading",
              attrs: { level: 2 },
              content: [{ type: "text", text: "How I Teach" }],
            },
          ],
        },
      },
    },
    {
      type: "grid",
      content: {
        columns: 2,
        gap: "md",
        align: "start",
        items: [
          {
            id: "a",
            placement: { colStart: 1, colSpan: 1, rowStart: 1, rowSpan: 2 },
            module: {
              type: "miniCard",
              content: {
                title: "Teaching Style",
                kind: "rte",
                doc: {
                  type: "doc",
                  content: [
                    {
                      type: "bulletList",
                      content: [
                        {
                          type: "listItem",
                          content: [
                            {
                              type: "text",
                              text: "Conceptual and structured explanations tailored to student needs.",
                            },
                          ],
                        },
                        {
                          type: "listItem",
                          content: [
                            {
                              type: "text",
                              text: "Emphasis on problem-solving techniques and exam strategies.",
                            },
                          ],
                        },
                        {
                          type: "listItem",
                          content: [
                            {
                              type: "text",
                              text: "Patient and encouraging approach to build student confidence.",
                            },
                          ],
                        },
                      ],
                    },
                  ],
                },
                variant: "neutral",
                }
              },
            },
            {
              id: "b",
              placement: { colStart: 2, colSpan: 1, rowStart: 1, rowSpan: 1 },
              module: {
                type: "miniCard",
                content: {
                  title: "Lesson Format",
                  kind: "rte",
                  doc: {
                    type: "doc",
                    content: [
                      {
                        type: "bulletList",
                        content: [
                          {
                            type: "listItem",
                            content: [
                              {
                                type: "text",
                                text: "Online (Zoom/Meet) with shared whiteboard and notes",
                              },
                            ],
                          },
                        ],
                      },
                    ],
                  },
                  variant: "neutral",
                }
              },
            },
            {
              id: "c",
              placement: { colStart: 2, colSpan: 1, rowStart: 2, rowSpan: 1 },
              module: {
                type: "miniCard",
                content: {
                  title: "Teaching Languages",
                  kind: "tags",
                  items: [
                    "English",
                    "Cantonese",
                    "Mandarin",
                  ],
                  variant: "neutral",
                },
              },
            },
        ],
      }, 
    },
  ],
};

export const statsSection: Section = {
  id: "stats",
  modules: [
    {
      type: "rte",
      content: {
        doc: {
          type: "doc",
          content: [
            {
              type: "heading",
              attrs: { level: 2 },
              content: [{ type: "text", text: "My Stats" }],
            },
          ],
        },
      },
    },
    {
      type: "grid",
      content: {
        columns: 2,
        gap: "md",
        align: "start",
        items: [
          {
            id: "a",
            placement: { colStart: 1, colSpan: 1 },
            module: {
              type: "miniCard",
              content: {
                kind: "value",
                title: "Students Taught",
                value: "250+",
                variant: "violet",
                align: "left",
              },
            },
          },
          {
            id: "b",
            placement: { colStart: 2, colSpan: 1 },
            module: {
              type: "miniCard",
              content: {
                kind: "value",
                title: "Hours Taught",
                value: "18000+",
                variant: "violet",
                align: "left",
              },
            },
          },
          {
            id: "c",
            placement: { colStart: 1, colSpan: 2 },
            module: {
              type: "miniCard",
              content: {
                kind: "value",
                title: "Response time",
                value: "< 2 hours",
                variant: "violet",
                align: "left",
              },
            },
          },
        ],
      },
    }
  ],
};

export const tutor2: Tutor2 = {
  profile: {
    verified: true,
    imageSrc: "/tutors/1.png",
    name: "Winson Siu",
    title: "International Mathematics Exam Strategist",
    subtitle: "國際數學科考試軍師",
    rating: "5.0 ★",
    hours: "18000+ hours taught",
    returnRate: 1,
  },
  sections: [
    aboutSection,
  ],
};

export const tutor: Tutor = {
  verified: true,
  imageSrc: "/tutors/1.png",
  name: "Winson Siu",
  title: "International Mathematics Exam Strategist",
  subtitle: "國際數學科考試軍師",
  rating: "5.0 ★",
  hours: "18000+ hours taught",
  returnRate: 1,
  about: {
    content: {
      type: "doc",
      content: [
        {
          type: "heading",
          attrs: { level: 2 },
          content: [{ type: "text", text: "About Me" }],
        },
        {
          type: "paragraph",
          content: [
            {
              type: "text",
              text: "I help students build strong fundamentals, then move into exam-style questions with a clear method.",
            },
          ],
        },
        {
          type: "heading",
          attrs: { level: 3 },
          content: [{ type: "text", text: "IBDP & A-Level Specialist" }],
        },
        {
          type: "bulletList",
          content: [
            {
              type: "listItem",
              content: [
                {
                  type: "paragraph",
                  content: [
                    {
                      type: "text",
                      text: "10+ years of experience tutoring IBDP & A-Level Math.",
                    },
                  ],
                },
              ],
            },
            {
              type: "listItem",
              content: [
                {
                  type: "paragraph",
                  content: [
                    {
                      type: "text",
                      text: "Extensive knowledge of exam formats, common pitfalls, and effective strategies.",
                    },
                  ],
                },
              ],
            },
            {
              type: "listItem",
              content: [
                {
                  type: "paragraph",
                  content: [
                    {
                      type: "text",
                      text: "Clear explanations and step-by-step structure",
                    },
                  ],
                },
              ],
            },
          ],
        },
        {
          type: "heading",
          attrs: { level: 3 },
          content: [{ type: "text", text: "Lifelong Tutoring Commitment" }],
        },
        {
          type: "bulletList",
          content: [
            {
              type: "listItem",
              content: [
                {
                  type: "paragraph",
                  content: [
                    {
                      type: "text",
                      text: "Dedicated to helping students achieve their academic goals.",
                    },
                  ],
                },
              ],
            },
            {
              type: "listItem",
              content: [
                {
                  type: "paragraph",
                  content: [
                    { type: "text", text: "Patient, encouraging, and adaptable teaching style." },
                  ],
                },
              ],
            },
            {
              type: "listItem",
              content: [
                {
                  type: "paragraph",
                  content: [
                    { type: "text", text: "Focus on building confidence and problem-solving skills." },
                  ],
                },
              ],
            },
          ],
        },
      ],
    },
    subjects: ["Math"],
    syllabuses: ["IBDP", "A-Level", "IGCSE"],
  },
  academic: {
    title: "Academic background",
    education: [
      {
        school: "CityUHK",
        degree: "BBA QFRM (Math Minor)",
        graduation: "First Class Honours",
      },
      {
        school: "High School Education",
        degree: "HK A-Level Examination Pure Mathematics",
        graduation: "A (Top 4.8%)",
      }
    ],
  },
  teaching: {
    title: "How I teach",
    teachingStyle: `
    - Conceptual and structured explanations tailored to student needs.
    - Emphasis on problem-solving techniques and exam strategies.
    - Patient and encouraging approach to build student confidence.
    `,
    lessonFormat: "Online (Zoom/Meet) with shared whiteboard and notes",
    teachingLanguage: "English, 中文 (Cantonese/Mandarin)."
  },
  stats: {
    title: "Tutor Stats",
    description: "Quick signals of experience and reliability.",
    data: [
      { k: "Students taught", v: "250+" },
      { k: "Total hours", v: "18000+" },
      { k: "Response time", v: "< 2 hours" },
    ]
  },
  reviews: {
    title: "Student Reviews",
    description: "Hear from students who have benefited from my tutoring."
  },
  booking: {
    price: 1500,
    availability: [
      "Weekdays (Evening)",
      "Sat (Morning)"
    ],
  },
};