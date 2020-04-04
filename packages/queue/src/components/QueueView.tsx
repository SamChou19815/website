import React, { ReactElement, useState } from 'react';

import Button from '@material-ui/core/Button';
import Card from '@material-ui/core/Card';
import CardActions from '@material-ui/core/CardActions';
import CardContent from '@material-ui/core/CardContent';
import CardHeader from '@material-ui/core/CardHeader';
import FormControlLabel from '@material-ui/core/FormControlLabel';
import Switch from '@material-ui/core/Switch';
import TextField from '@material-ui/core/TextField';
import Typography from '@material-ui/core/Typography';
import { getAppUser } from 'lib-firebase/authentication';
import { useHistory } from 'react-router';

import { AppQueue } from '../models/types';
import { createNewQuestion } from '../util/firestore-actions';
import { useQuestions } from '../util/use-collections';
import LoadingPage from './LoadingPage';
import QuestionCard from './QuestionCard';

export default ({ queue }: { readonly queue: AppQueue }): ReactElement => {
  const history = useHistory();
  const questions = useQuestions(queue.queueId);
  const myEmail = getAppUser().email;
  const isQueueOwner = queue.owner === myEmail;
  const [hideAnsweredQuestions, setHideAnsweredQuestions] = useState(true);
  const [newQuestionContent, setNewQuestionContent] = useState('');

  if (questions === null) {
    return <LoadingPage />;
  }

  const filteredQuestions = hideAnsweredQuestions
    ? questions.filter((question) => !question.answered)
    : questions;

  return (
    <div className="card-container">
      <Button
        variant="outlined"
        color="primary"
        className="centered-button"
        onClick={() => history.push('/')}
        disableElevation
      >
        Back to queues
      </Button>
      <Typography component="h2" variant="h4" className="centered-title">
        Questions
      </Typography>
      {questions.length === 0 && <div>No questions yet.</div>}
      {questions.length > 0 && (
        <FormControlLabel
          className="centered-title"
          control={
            // eslint-disable-next-line react/jsx-wrap-multilines
            <Switch
              checked={hideAnsweredQuestions}
              onChange={(event) => setHideAnsweredQuestions(event.target.checked)}
            />
          }
          label="Show/Hide answered questions"
          labelPlacement="start"
        />
      )}
      {filteredQuestions.map((question) => (
        <QuestionCard key={question.questionId} isQueueOwner={isQueueOwner} question={question} />
      ))}
      <Card variant="outlined" className="common-card">
        <CardHeader title="Add new question" />
        <CardContent>
          <TextField
            label="Question content"
            type="text"
            className="text-input"
            value={newQuestionContent}
            onChange={(event) => setNewQuestionContent(event.currentTarget.value)}
          />
        </CardContent>
        <CardActions>
          <Button
            size="small"
            color="primary"
            disabled={newQuestionContent.trim().length === 0}
            onClick={() => {
              createNewQuestion(queue.queueId, newQuestionContent);
              setNewQuestionContent('');
            }}
          >
            Submit
          </Button>
        </CardActions>
      </Card>
    </div>
  );
};
