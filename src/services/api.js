let defects = [
  {
    id: "1",
    title: "Нет плитки",
    description: "Отсутсвует часть плитки в полу",
    projectId: "1",
    priority: "high",
    status: "in_progress",
    assigneeId: "2",
    createdBy: "1",
    createdAt: "2025-10-05",
    dueDate: "2025-12-31",
    comments: [
      {
        id: "1",
        text: "По-моему это проблемы жкх",
        authorId: "1",
        createdAt: "2025-10-05T17:30:26",
      },
    ],
  },
];

let projects = [
  {
    id: "1",
    name: 'УЛ Удальцова',
    description: "Многоэтажный дом",
    address: "ул Удальцова Д.89",
    startDate: "2025-10-05",
    endDate: "2025-12-31",
  },
];

let users = [
  { id: "1", name: "Злой Менеджеров", role: "manager" },
  { id: "2", name: "Инженер Тимфортресович", role: "engineer" },
  { id: "3", name: "Сталкер Смотрячевич", role: "observer" },
];

export const getDefects = async () => {
  return new Promise((resolve) => setTimeout(() => resolve(defects), 500));
};

export const getDefect = async (id) => {
  return new Promise((resolve) =>
    setTimeout(() => {
      resolve(defects.find((d) => d.id === id));
    }, 500)
  );
};

export const updateDefect = async (id, data) => {
  return new Promise((resolve) =>
    setTimeout(() => {
      if (typeof id === "object") {
        const newDefect = {
          ...id,
          id: Date.now().toString(),
        };
        defects.push(newDefect);
        resolve(newDefect);
      } else {
        const index = defects.findIndex((d) => d.id === id);
        if (index !== -1) {
          defects[index] = { ...defects[index], ...data };
          resolve(defects[index]);
        }
      }
    }, 500)
  );
};

export const getProjects = async () => {
  return new Promise((resolve) => setTimeout(() => resolve(projects), 500));
};

export const createProject = async (data) => {
  return new Promise((resolve) =>
    setTimeout(() => {
      const newProject = {
        ...data,
        id: Date.now().toString(),
      };
      projects.push(newProject);
      resolve(newProject);
    }, 500)
  );
};

export const updateProject = async (id, data) => {
  return new Promise((resolve) =>
    setTimeout(() => {
      const index = projects.findIndex((p) => p.id === id);
      if (index !== -1) {
        projects[index] = { ...projects[index], ...data };
        resolve(projects[index]);
      }
    }, 500)
  );
};

export const getUsers = async () => {
  return new Promise((resolve) => setTimeout(() => resolve(users), 500));
};

export const addComment = async (defectId, comment) => {
  return new Promise((resolve) =>
    setTimeout(() => {
      const defect = defects.find((d) => d.id === defectId);
      if (defect) {
        if (!defect.comments) defect.comments = [];
        defect.comments.push({
          ...comment,
          id: Date.now().toString(),
        });
      }
      resolve(defect);
    }, 500)
  );
};
