const request = require("supertest");
const { MongoMemoryServer } = require("mongodb-memory-server");
const { default: mongoose } = require("mongoose");

jest.mock("../middleware/auth", () => {
  return (req, res, next) => {
    req.user = { userId: "1234567890abcdef12345678" };
    next();
  };
});

const app = require("../app");

let mongoServer;

beforeAll(async () => {
  mongoServer = await MongoMemoryServer.create();
  await mongoose.connect(mongoServer.getUri(), { dbName: "test" });
});

afterAll(async () => {
  await mongoose.disconnect();
  await mongoServer.stop();
});

describe("Post /projects/:id/like", () => {
  it("like un projet", async () => {
    const projectResponse = await request(app)
      .post("/api/projects")
      .send({ title: "Mon projet" })
      .set("Authorization", `Bearer token`);

    const projectId = projectResponse.body._id;

    const res = await request(app)
      .post(`/api/projects/${projectId}/like`)
      .set("Authorization", `Bearer token`);

    expect(res.statusCode).toBe(200);
    expect(res.body.likes).toHaveLength(1);
  });
});
