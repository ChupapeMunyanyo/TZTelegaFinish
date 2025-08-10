import React from 'react';

interface SubmitButtonsProps {
  onCreate: () => void;
  onCreateAndPost: () => void;
}

const SubmitButtons: React.FC<SubmitButtonsProps> = ({ onCreate, onCreateAndPost }) => {
  return (
    <div className="form-container">
      <h2>Подтверждение</h2>
      <div className="buttons-container">
        <button onClick={onCreate} className="submit-button">
          Создать продажу
        </button>
        <button onClick={onCreateAndPost} className="submit-button primary">
          Создать и провести
        </button>
      </div>
    </div>
  );
};

export default SubmitButtons;
