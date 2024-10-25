const express = require("express");
const cors = require("cors");
const fs = require("fs");
const { v4: uuidv4 } = require("uuid");

const app = express();
app.use(cors());
app.use(express.json());

app.post("/register", (req, res) => {
  const newUser = { ...req.body, id: uuidv4() };

  if (!newUser || Object.keys(newUser).length === 0) {
    return res.status(400).json({ message: "Invalid data" });
  }

  fs.readFile("./data.json", "utf8", (err, data) => {
    if (err) {
      return res.status(500).json({ message: "Error reading file" });
    }

    let parsedData = [];

    try {
      if (data.trim() === "") {
        parsedData = [];
      } else {
        parsedData = JSON.parse(data);
      }
    } catch (parseError) {
      return res.status(500).json({ message: "Error parsing JSON data" });
    }

    parsedData.push(newUser);

    fs.writeFile("./data.json", JSON.stringify(parsedData, null, 2), (err) => {
      if (err) {
        return res.status(500).json({ message: "Error writing file" });
      }
      res.status(200).json({ message: "Registration successful!" });
    });
  });
});

const jwt = require("jsonwebtoken");

app.post("/login", (req, res) => {
  const { email, password } = req.body;

  if (!email || !password) {
    return res.status(400).json({ message: "Email and password are required" });
  }

  fs.readFile("./data.json", "utf8", (err, data) => {
    if (err) {
      console.error("Error reading file:", err);
      return res.status(500).json({ message: "Error reading file" });
    }
    try {
      const parsedData = JSON.parse(data);
      const user = parsedData.find(
        (user) => user.email === email && user.password === password
      );
      console.log(user);
      if (!user) {
        return res.status(401).json({ message: "Invalid email or password" });
      }

      const token = jwt.sign({ email: user.email }, "your-secret-key", {
        expiresIn: "1h",
      });

      res.status(200).json({ token });
    } catch (parseError) {
      console.error("Error parsing JSON:", parseError);
      return res.status(500).json({ message: "Error parsing JSON data" });
    }
  });
});

app.post("/addclient", (req, res) => {
  const newUser = { ...req.body, id: uuidv4() };

  if (!newUser || Object.keys(newUser).length === 0) {
    return res.status(400).json({ message: "Invalid data" });
  }

  fs.readFile("./client.json", "utf8", (err, data) => {
    if (err) {
      return res.status(500).json({ message: "Error reading file" });
    }

    let parsedData = [];

    try {
      if (data.trim() === "") {
        parsedData = [];
      } else {
        parsedData = JSON.parse(data);
      }
    } catch (parseError) {
      return res.status(500).json({ message: "Error parsing JSON data" });
    }

    parsedData.push(newUser);

    fs.writeFile(
      "./client.json",
      JSON.stringify(parsedData, null, 2),
      (err) => {
        if (err) {
          return res.status(500).json({ message: "Error writing file" });
        }
        res.status(200).json({ message: "Client successful Added!" });
      }
    );
  });
});

app.get("/client", (req, res) => {
  fs.readFile("./client.json", "utf8", (err, data) => {
    if (err) {
      return res.status(500).json({ message: "Error reading file" });
    }

    try {
      const clients = JSON.parse(data);
      res.status(200).json(clients);
    } catch (parseError) {
      return res.status(500).json({ message: "Error parsing JSON data" });
    }
  });
});

app.put("/client/:id", (req, res) => {
  const { id } = req.params;
  const updatedClient = req.body;

  fs.readFile("./client.json", "utf8", (err, data) => {
    if (err) {
      return res.status(500).json({ message: "Error reading file" });
    }

    try {
      const clients = JSON.parse(data);
      const clientIndex = clients.findIndex((client) => client.id === id);

      if (clientIndex === -1) {
        return res.status(404).json({ message: "Client not found" });
      }

      clients[clientIndex] = { ...clients[clientIndex], ...updatedClient };

      fs.writeFile(
        "./client.json",
        JSON.stringify(clients, null, 2),
        (err) => {
          if (err) {
            return res.status(500).json({ message: "Error writing file" });
          }
          res.status(200).json({ message: "Client updated successfully" });
        }
      );
    } catch (parseError) {
      return res.status(500).json({ message: "Error parsing JSON data" });
    }
  });
});


app.delete("/client/:id", (req, res) => {
  const { id } = req.params;

  fs.readFile("./client.json", "utf8", (err, data) => {
    if (err) {
      return res.status(500).json({ message: "Error reading file" });
    }

    try {
      const clients = JSON.parse(data);
      const updatedClients = clients.filter((client) => client.id !== id);

      fs.writeFile(
        "./client.json",
        JSON.stringify(updatedClients, null, 2),
        (err) => {
          if (err) {
            return res.status(500).json({ message: "Error writing file" });
          }
          res.status(200).json({ message: "Client deleted successfully" });
        }
      );
    } catch (parseError) {
      return res.status(500).json({ message: "Error parsing JSON data" });
    }
  });
});

app.post("/addinvoice", (req, res) => {
  const newUser = { ...req.body, id: uuidv4() };

  if (!newUser || Object.keys(newUser).length === 0) {
    return res.status(400).json({ message: "Invalid data" });
  }

  fs.readFile("./invoice.json", "utf8", (err, data) => {
    if (err) {
      return res.status(500).json({ message: "Error reading file" });
    }

    let parsedData = [];

    try {
      if (data.trim() === "") {
        parsedData = [];
      } else {
        parsedData = JSON.parse(data);
      }
    } catch (parseError) {
      return res.status(500).json({ message: "Error parsing JSON data" });
    }

    parsedData.push(newUser);

    fs.writeFile(
      "./invoice.json",
      JSON.stringify(parsedData, null, 2),
      (err) => {
        if (err) {
          return res.status(500).json({ message: "Error writing file" });
        }
        res.status(200).json({ message: "Client successful Added!" });
      }
    );
  });
});

app.get("/invoice", (req, res) => {
  fs.readFile("./invoice.json", "utf8", (err, data) => {
    if (err) {
      return res.status(500).json({ message: "Error reading file" });
    }

    try {
      const invoices = JSON.parse(data);
      res.status(200).json(invoices);
    } catch (parseError) {
      return res.status(500).json({ message: "Error parsing JSON data" });
    }
  });
});

app.delete("/invoice/:id", (req, res) => {
  const { id } = req.params;

  fs.readFile("./invoice.json", "utf8", (err, data) => {
    if (err) {
      return res.status(500).json({ message: "Error reading file" });
    }

    try {
      const invoices = JSON.parse(data);
      const updatedInvoices = invoices.filter((invoice) => invoice.id !== id);

      fs.writeFile(
        "./invoice.json",
        JSON.stringify(updatedInvoices, null, 2),
        (err) => {
          if (err) {
            return res.status(500).json({ message: "Error writing file" });
          }
          res.status(200).json({ message: "Invoice deleted successfully" });
        }
      );
    } catch (parseError) {
      return res.status(500).json({ message: "Error parsing JSON data" });
    }
  });
});

const PORT = process.env.PORT || 5000;
app.listen(PORT, () => {
  console.log(`Server running on port ${PORT}`);
});
