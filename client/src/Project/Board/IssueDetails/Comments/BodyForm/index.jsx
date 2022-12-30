import React, { Fragment } from 'react';
import PropTypes from 'prop-types';

import { TextEditor } from 'shared/components';

import { Actions, FormButton } from './Styles';

const propTypes = {
  value: PropTypes.string.isRequired,
  onChange: PropTypes.func.isRequired,
  isWorking: PropTypes.bool.isRequired,
  onSubmit: PropTypes.func.isRequired,
  onCancel: PropTypes.func.isRequired,
};

const ProjectBoardIssueDetailsCommentsBodyForm = ({
  value,
  onChange,
  isWorking,
  onSubmit,
  onCancel,
}) => {

  const handleSubmit = () => {
    if (value.trim()) {
      onSubmit();
    }
  };

  return (
    <Fragment>
      <TextEditor
        autoFocus
        placeholder="Add a comment..."
        value={value}
        onChange={onChange}
      />
      <Actions>
        <FormButton variant="primary" isWorking={isWorking} onClick={handleSubmit}>
          Save
        </FormButton>
        <FormButton variant="empty" onClick={onCancel}>
          Cancel
        </FormButton>
      </Actions>
    </Fragment>
  );
};

ProjectBoardIssueDetailsCommentsBodyForm.propTypes = propTypes;

export default ProjectBoardIssueDetailsCommentsBodyForm;
