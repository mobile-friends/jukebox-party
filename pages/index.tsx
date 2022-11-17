import Button from "../components/elements/button";
import Input from "../components/elements/input";

export default function Home() {
  return (
    <div style={{
      height: '100vh',
      padding: '20px',
      display: 'flex',
      flexDirection: 'column',
      justifyContent: 'space-between',
    }}>
      <h1 className="text-center">jukebox.<span className="text-primary text-italic">party</span></h1>

      <form>
        <Input placeholder="Name"></Input>
        <Input placeholder="Session id"></Input>
        <Button text="Join session" type="primary"></Button>
      </form>

      <Button text="Create session" type="tertiary"></Button>
    </div>
  );
}
