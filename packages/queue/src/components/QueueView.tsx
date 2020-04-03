import React, { ReactElement, useState } from 'react';

import { getAppUser } from 'lib-firebase/authentication';

import { AppQueue } from '../models/types';
import { questionsCollection } from '../util/firestore';
import { createNewQuestion } from '../util/firestore-actions';
import { useQuestions } from '../util/use-collections';
import LoadingPage from './LoadingPage';

export default ({ queue }: { readonly queue: AppQueue }): ReactElement => {
  const questions = useQuestions(queue.queueId);
  const myEmail = getAppUser().email;
  const isQueueOwner = queue.owner === myEmail;
  const [newQuestionContent, setNewQuestionContent] = useState('');

  if (questions === null) {
    return <LoadingPage />;
  }

  return (
    <div>
      <div>
        <h2>Questions</h2>
        {questions.map((question) => (
          <div key={question.questionId}>
            <div>{question.content}</div>
            <div>Answered: {String(question.answered)}</div>
            <div>Timestamp: {question.timestamp.toISOString()}</div>
            {isQueueOwner && (
              <button
                type="button"
                onClick={() => {
                  questionsCollection
                    .doc(question.questionId)
                    .update({ answered: !question.answered });
                }}
              >
                Mark as {question.answered ? 'unanswered' : 'answered'}
              </button>
            )}
            {question.owner === myEmail && (
              <button
                type="button"
                onClick={() => questionsCollection.doc(question.questionId).delete()}
              >
                Delete
              </button>
            )}
          </div>
        ))}
      </div>
      <div>
        <h2>Add new question</h2>
        <div>
          <input
            type="text"
            placeholder="Question content"
            value={newQuestionContent}
            onChange={(event) => setNewQuestionContent(event.currentTarget.value)}
          />
        </div>
        <button
          type="button"
          disabled={newQuestionContent.trim().length === 0}
          onClick={() => {
            createNewQuestion(queue.queueId, newQuestionContent);
            setNewQuestionContent('');
          }}
        >
          Submit
        </button>
      </div>
    </div>
  );
};
