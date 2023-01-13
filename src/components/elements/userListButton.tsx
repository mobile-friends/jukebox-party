import { PartyCode } from '@common/types/partyCode';
import UserListModal from '@component/userListModal';
import useToggle from '@hook/useToggle';
import Button from './button';
import { FaUsers } from 'react-icons/fa';

interface Props {
  partyCode: PartyCode;
  isHost: boolean;
}

export default function UserListButton({ partyCode, isHost }: Props) {
  const [isModalVisible, toggleModalVisibility] = useToggle();

  return (
    <div>
      <Button
        styleType='icon-only small'
        content={<FaUsers />}
        onClick={toggleModalVisibility}
      />

      {isModalVisible && (
        <UserListModal
          partyCode={partyCode}
          isHost={isHost}
          onClosed={toggleModalVisibility}
        />
      )}
    </div>
  );
}
