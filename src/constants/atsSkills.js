export const ATS_SKILLS = {
    Backend: {
      frameworks: [
        "express",
        "nestjs",
        "spring",
        "spring boot",
        "django",
        "flask",
        "fastapi",
      ],
  
      databases: [
        "mongodb",
        "mysql",
        "postgresql",
        "redis",
        "sql",
      ],
  
      dsaLanguages: [
        "java",
        "c++",
        "python",
        "javascript",
      ],
  
      architecture: [
        "rest api",
        "microservices",
        "system design",
        "scalability",
        "authentication",
        "jwt",
      ],
  
      weights: {
        frameworks: 0.5,
        databases: 0.2,
        dsaLanguages: 0.15,
        architecture: 0.15,
      },
    },
  
    DevOps: {
      tools: [
        "docker",
        "kubernetes",
        "jenkins",
        "github actions",
        "terraform",
      ],
      cloud: ["aws", "gcp", "azure"],
      weights: {
        tools: 0.6,
        cloud: 0.4,
      },
    },
  
    AIML: {
      core: [
        "machine learning",
        "deep learning",
        "model training",
      ],
      libraries: [
        "tensorflow",
        "pytorch",
        "scikit-learn",
        "numpy",
        "pandas",
      ],
      weights: {
        core: 0.6,
        libraries: 0.4,
      },
    },
  };