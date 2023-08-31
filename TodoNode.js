const http = require('http');
const url = require('url');
const port = 3000;
const host = 'localhost';

let Todos = [];

const server = http.createServer((req, res) => {
  const reqUrl = new URL(req.url, `http://${req.headers.host}`);
  const pathname = reqUrl.pathname;

  if (req.method === 'GET' && pathname === '/') {
    res.setHeader('Content-Type', 'application/json');
    res.statusCode = 200;
    res.end(JSON.stringify({ Todos }));
  } else if (req.method === 'POST' && pathname === '/') {
    let body = '';
    req.on('data', chunk => {
      body += chunk.toString();
    });

    req.on('end', () => {
      const todo = JSON.parse(body);
      if (Object.keys(todo).length > 0) {
        Todos.push(todo);
        res.statusCode = 200;
        res.end(JSON.stringify(todo));
      } else {
        res.statusCode = 400;
        res.end('Empty body is not allowed');
      }
    });
  } else if (req.method === 'DELETE' && pathname.startsWith('/')) {
    const todoId = +pathname.slice(1);
    if (Todos.length > 0) {
      Todos = Todos.filter(todo => +todo.id !== todoId);
      res.statusCode = 200;
      res.end(JSON.stringify(Todos));
    } else {
      res.statusCode = 200;
      res.end('Todos array already empty');
    }
  } else if (req.method === 'PUT' && pathname.startsWith('/')) {
    const todoId = +pathname.slice(1);

    const index = Todos.findIndex(todo => +todo.id === todoId);
    if (index > -1) {
      let body = '';
      req.on('data', chunk => {
        body += chunk.toString();
      });

      req.on('end', () => {
        const todo = JSON.parse(body);
        Todos[index] = todo;
        res.statusCode = 200;
        res.end(JSON.stringify(Todos[index]));
      });
    } else {
      res.statusCode = 404;
      res.end('No todo to update');
    }
  } else {
    res.statusCode = 404;
    res.end('Not found');
  }
});

server.listen(port, host, () => {
  console.log(`Server is running on ${host} port ${port}`);
});
