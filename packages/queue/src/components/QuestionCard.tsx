import React, { ReactElement } from 'react';

import Button from '@material-ui/core/Button';
import Card from '@material-ui/core/Card';
import CardActions from '@material-ui/core/CardActions';
import CardContent from '@material-ui/core/CardContent';
import CardHeader from '@material-ui/core/CardHeader';
import { getAppUser } from 'lib-firebase/authentication';

import { AppQuestion } from '../models/types';
import { editQuestion, deleteQuestion } from '../util/firestore-actions';

type Props = { readonly isQueueOwner: boolean; readonly question: AppQuestion };

export default ({ isQueueOwner, question }: Props): ReactElement => {
  const isQuestionOwner = getAppUser().email === question.owner;

  const onMark = (): void => editQuestion(question.questionId, { answered: !question.answered });

  const onEdit = (): void => {
    // eslint-disable-next-line no-alert
    const content = prompt('New Content', question.content);
    if (content == null || content.trim().length === 0) {
      return;
    }
    editQuestion(question.questionId, { content });
  };

  const onDelete = (): void => deleteQuestion(question.questionId);

  return (
    <Card variant="outlined" className="common-card">
      <CardHeader title={question.content} />
      <CardContent>Answered: {String(question.answered)}</CardContent>
      <CardContent>Timestamp: {question.timestamp.toISOString()}</CardContent>
      {(isQueueOwner || isQuestionOwner) && (
        <CardActions>
          {isQueueOwner && (
            <Button size="small" color="primary" onClick={onMark}>
              Mark as {question.answered ? 'unanswered' : 'answered'}
            </Button>
          )}
          {isQuestionOwner && (
            <Button size="small" color="primary" onClick={onEdit}>
              Edit
            </Button>
          )}
          {isQuestionOwner && (
            <Button size="small" color="primary" onClick={onDelete}>
              Delete
            </Button>
          )}
        </CardActions>
      )}
    </Card>
  );
};
