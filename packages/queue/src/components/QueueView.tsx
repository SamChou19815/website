import React, { ReactElement, useState, useEffect } from 'react';

import Button from '@material-ui/core/Button';
import Card from '@material-ui/core/Card';
import CardActions from '@material-ui/core/CardActions';
import CardContent from '@material-ui/core/CardContent';
import CardHeader from '@material-ui/core/CardHeader';
import FormControlLabel from '@material-ui/core/FormControlLabel';
import Switch from '@material-ui/core/Switch';
import TextField from '@material-ui/core/TextField';
import Typography from '@material-ui/core/Typography';
import Announcement from '@material-ui/icons/Announcement';
import { getAppUser } from 'lib-firebase/authentication';
import { useHistory } from 'react-router';

import { AppQueue } from '../models/types';
import { createNewQuestion } from '../util/firestore-actions';
import { useQuestions } from '../util/use-collections';
import LoadingPage from './LoadingPage';
import QuestionCard from './QuestionCard';

const useAlert = (isMyTurn: boolean): void => {
  const [previousIsMyTurn, setPreviousIsMyTurn] = useState(false);

  useEffect(() => {
    if (previousIsMyTurn !== isMyTurn) {
      setPreviousIsMyTurn(isMyTurn);
    }
    if (!previousIsMyTurn && isMyTurn) {
      try {
        Notification.requestPermission().then(() => {
          if (Notification.permission === 'granted') {
            // eslint-disable-next-line no-new
            new Notification('Your turn', { body: 'The host is answering your question now' });
          }
        });
      } catch {
        // eslint-disable-next-line no-console
        console.error('You are on mobile iOS device. iOS Safari sucks.');
      }
    }
  }, [previousIsMyTurn, isMyTurn]);
};

export default ({ queue }: { readonly queue: AppQueue }): ReactElement => {
  const history = useHistory();
  const questions = useQuestions(queue.queueId);
  const myEmail = getAppUser().email;
  const isQueueOwner = queue.owner === myEmail;
  const [hideAnsweredQuestions, setHideAnsweredQuestions] = useState(true);
  const [newQuestionContent, setNewQuestionContent] = useState('');

  const unansweredQuestions = questions?.filter((question) => !question.answered) ?? [];
  const answeringMyQuestion =
    unansweredQuestions.length > 0 && unansweredQuestions[0].owner === myEmail;

  useAlert(answeringMyQuestion);

  if (questions === null) {
    return <LoadingPage />;
  }

  const filteredQuestions = hideAnsweredQuestions ? unansweredQuestions : questions;

  return (
    <div className="card-container">
      <div className="centered-title">
        <Typography
          component="h2"
          variant="h4"
          style={{ display: 'inline-block', marginRight: '1em' }}
        >
          Questions
        </Typography>
        <Button
          variant="outlined"
          color="primary"
          onClick={() => history.push('/')}
          disableElevation
        >
          Back to queues
        </Button>
      </div>
      {answeringMyQuestion && (
        <Card variant="outlined" className="common-card">
          <CardHeader
            avatar={<Announcement titleAccess="Question" fontSize="large" />}
            classes={{ root: 'alert-card-background', title: 'common-card-header-text' }}
            title="YOUR QUESTION's TIME!!!"
            titleTypographyProps={{ variant: 'h6' }}
          />
        </Card>
      )}
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
