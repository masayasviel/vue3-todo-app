import express from 'express';
import cors from 'cors';
import { v4 as uuidv4 } from 'uuid';
import { Tasks, TaskListResponse, ItemStateLiteral } from './interfaces';

const app = express();
app.use(express.json());
app.use(cors());

const data: {
  [key in string]: Tasks;
} = {
  default1: {
    title: 'タイトル1',
    status: '未着手',
  },
  default2: {
    title: 'タイトル2',
    status: '進行',
  },
  default3: {
    title: 'タイトル3',
    status: '完了',
  },
  default4: {
    title: 'タイトル4',
    status: '未着手',
  },
};

app.get('/', (_req, res) => {
  const responseData = {
    notStartedYetCategory: new Array<TaskListResponse>(),
    wipCategory: new Array<TaskListResponse>(),
    finishCategory: new Array<TaskListResponse>(),
  };
  Object.entries(data).forEach(([key, task]) => {
    switch (task.status) {
      case '未着手':
        responseData.notStartedYetCategory.push({
          uuid: key,
          ...task,
        });
        break;
      case '進行':
        responseData.wipCategory.push({
          uuid: key,
          ...task,
        });
        break;
      case '完了':
        responseData.finishCategory.push({
          uuid: key,
          ...task,
        });
        break;
    }
  });
  res.status(200).send(responseData);
});

app.post('/', (req, res) => {
  data[uuidv4()] = req.body as Tasks;
  res.status(201).send('Created');
});

app.patch('/:uuid/status', (req, res) => {
  const uuid = req.params.uuid;
  if (!(uuid in data)) {
    res.status(404).send('Not Found');
    return;
  }
  data[uuid].status = req.body['status'] as ItemStateLiteral;
  res.status(204).send('No Content');
});

app.delete('/:uuid', (req, res) => {
  const uuid = req.params.uuid;
  if (!(uuid in data)) {
    res.status(404).send('Not Found');
    return;
  }
  delete data[uuid];
  res.status(204).send('No Content');
});

app.listen(4200, () => {
  console.log('http://localhost:4200');
});
