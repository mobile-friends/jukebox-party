import { useState } from 'react';

type UseModalVisibilityProps = {
  isModalVisible: boolean;
  handleModalVisibility: () => void;
};

export const useModalVisibility = (): UseModalVisibilityProps => {
  const [isModalVisible, setIsModalVisible] = useState<boolean>(false);

  const handleModalVisibility = () => {
    setIsModalVisible(!isModalVisible);
  };

  return {
    isModalVisible,
    handleModalVisibility,
  };
};
