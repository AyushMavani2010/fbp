const express = require("express");
const cors = require("cors");
const fs = require("fs");
const { v4: uuidv4 } = require("uuid");
const { graphqlHTTP } = require("express-graphql");
const { buildSchema } = require("graphql");

const app = express();
app.use(cors());
app.use(express.json());

const readJSONFile = (filePath) => {
  if (!fs.existsSync(filePath)) return [];
  const data = fs.readFileSync(filePath, "utf8");
  return data.trim() ? JSON.parse(data) : [];
};

const writeJSONFile = (filePath, data) => {
  fs.writeFileSync(filePath, JSON.stringify(data, null, 2));
};

const schema = buildSchema(`
  type User {
    id: String
    name: String
    email: String
    password: String
  }

  type Client {
    id: String
    name: String
    email: String
    phone: String
    userId: String
  }

  type Company {
    id: String
    company: String
    companyEmail: String
    companyAddress: String
    gstNumber: String
    userId: String
  }

  type Invoice {
    id: String
    userId: String
    details: String
    amount: Float
  }

  type Query {
    users: [User]
    clients(userId: String): [Client]
    companies(userId: String): [Company]
    invoices(userId: String): [Invoice]
  }

  type Mutation {
    addUser(name: String!, email: String!, password: String!): User
    addClient(name: String!, email: String!, phone: String!, userId: String!): Client
    addCompany(company: String!, companyEmail: String!, companyAddress: String!, gstNumber: String!, userId: String!): Company
    addInvoice(userId: String!, details: String!, amount: Float!): Invoice
  }
`);

const root = {
  users: () => readJSONFile("./data.json"),
  clients: ({ userId }) => {
    const clients = readJSONFile("./client.json");
    return userId
      ? clients.filter((client) => client.userId === userId)
      : clients;
  },
  companies: ({ userId }) => {
    const companies = readJSONFile("./company.json");
    return userId
      ? companies.filter((company) => company.userId === userId)
      : companies;
  },
  invoices: ({ userId }) => {
    const invoices = readJSONFile("./invoice.json");
    return userId
      ? invoices.filter((invoice) => invoice.userId === userId)
      : invoices;
  },
  addUser: ({ name, email, password }) => {
    const users = readJSONFile("./data.json");
    const newUser = { id: uuidv4(), name, email, password };
    users.push(newUser);
    writeJSONFile("./data.json", users);
    return newUser;
  },
  addClient: ({ name, email, phone, userId }) => {
    const clients = readJSONFile("./client.json");
    const newClient = { id: uuidv4(), name, email, phone, userId };
    clients.push(newClient);
    writeJSONFile("./client.json", clients);
    return newClient;
  },
  addCompany: ({
    company,
    companyEmail,
    companyAddress,
    gstNumber,
    userId,
  }) => {
    const companies = readJSONFile("./company.json");
    const newCompany = {
      id: uuidv4(),
      company,
      companyEmail,
      companyAddress,
      gstNumber,
      userId,
    };
    companies.push(newCompany);
    writeJSONFile("./company.json", companies);
    return newCompany;
  },
  addInvoice: ({ userId, details, amount }) => {
    const invoices = readJSONFile("./invoice.json");
    const newInvoice = { id: uuidv4(), userId, details, amount };
    invoices.push(newInvoice);
    writeJSONFile("./invoice.json", invoices);
    return newInvoice;
  },
};

app.use(
  "/graphql",
  graphqlHTTP({
    schema: schema,
    rootValue: root,
    graphiql: true,
  })
);

app.get("/users", (req, res) => {
  try {
    const users = readJSONFile("./data.json");
    res.status(200).json(users);
  } catch {
    res.status(500).json({ message: "Error reading users data" });
  }
});

app.post("/register", (req, res) => {
  const newUser = { ...req.body, id: uuidv4() };
  const users = readJSONFile("./data.json");
  users.push(newUser);
  writeJSONFile("./data.json", users);
  res
    .status(200)
    .json({ message: "User registered successfully", id: newUser.id });
});

app.post("/addcompany", (req, res) => {
  const { company, companyEmail, companyAddress, gstNumber, userId } = req.body;
  const companies = readJSONFile("./company.json");
  const newCompany = {
    id: uuidv4(),
    company,
    companyEmail,
    companyAddress,
    gstNumber,
    userId,
  };
  companies.push(newCompany);
  writeJSONFile("./company.json", companies);
  res.status(200).json({ message: "Company added successfully" });
});

const PORT = process.env.PORT || 5000;
app.listen(PORT, () => {
  console.log(`Server running on port ${PORT}`);
});
