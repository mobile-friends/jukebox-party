import useToggle from '@hook/useToggle';
import Button from './button';
import AboutUsModal from '@component/aboutUsModal';
import { AiOutlineInfoCircle } from 'react-icons/ai';

export default function AboutUsButton() {
  const [isModalVisible, toggleModalVisibility] = useToggle();

  return (
    <div>
      <Button
        styleType='icon-only small'
        content={<AiOutlineInfoCircle />}
        onClick={toggleModalVisibility}
      />

      {isModalVisible && (
        <AboutUsModal onClosed={toggleModalVisibility}/>
      )}
    </div>
  );
}
