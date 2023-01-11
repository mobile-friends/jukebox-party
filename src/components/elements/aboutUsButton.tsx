import useToggle from '@hook/useToggle';
import Button from './button';
import AboutUsModal from '@component/aboutUsModal';
import { MdInfoOutline } from 'react-icons/md';

export default function UserListButton() {
  const [isModalVisible, toggleModalVisibility] = useToggle();

  return (
    <div>
      <Button
        styleType='icon-only small'
        content={<MdInfoOutline />}
        onClick={toggleModalVisibility}
      />

      {isModalVisible && (
        <AboutUsModal onClosed={toggleModalVisibility}/>
      )}
    </div>
  );
}
