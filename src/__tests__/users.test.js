/* eslint-disable no-undef */
import request from "supertest";
import faker from "faker";
import { StatusCodes } from "http-status-codes";
import app from "../app.js";
import createTable, { dropTable } from "../models/users.js";

beforeEach(async () => {
    await createTable();
});

afterEach(async () => {
    await dropTable();
});

export async function createUser() {
    const payload = {
        name: faker.name.findName(),
        email: faker.internet.email(),
        account_balance: faker.datatype.float(),
    };

    const { body } = await request(app).post("/api/v1/user").send(payload);

    return body.account;
}

export async function signInUser() {
    const user = await createUser();
    const payload = {
        email: user.email,
        account_number: user.account_number,
    };

    const { body } = await request(app).post("/api/v1/user/signin").send(payload);

    console.log(body);
}

test("Should create a new user", async () => {
    const payload = {
        name: faker.name.findName(),
        email: faker.internet.email(),
        account_balance: faker.datatype.float(),
    };

    const { body, status } = await request(app).post("/api/v1/user").send(payload);

    expect(status).toBe(StatusCodes.CREATED);
    expect(body).toHaveProperty("account");
    expect(body.account.name).toBe(payload.name);
    expect(body.account.email).toBe(payload.email);
    expect(body.account.account_balance).toBe(payload.account_balance);
    expect(body.account.account_number).toBeDefined();
    expect(body.account.id).toBeDefined();
    expect(body.message).toMatch(/created successfully/i);
});

test("Should sign a user in", async () => {
    const user = await createUser();
    const payload = {
        email: user.email,
        account_number: user.account_number,
    };

    const { body, status } = await request(app).post("/api/v1/user/signin").send(payload);

    console.log(body);
    expect(status).toBe(StatusCodes.OK);
    expect(body).toHaveProperty("account");
    expect(body).toHaveProperty("token");
    expect(body.message).toMatch(/signed in successfully/i);
    expect(body.account.name).toBe(user.name);
    expect(body.account.email).toBe(payload.email);
    expect(body.account.account_balance).toBe(user.account_balance);
    expect(body.account.account_number).toBeDefined();
    expect(body.account.id).toBeDefined();
});
