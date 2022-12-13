import { useSession, signIn, signOut } from 'next-auth/react'; function LoginButton(){
  const { data: session } = useSession();
  const userEmail = session?.user?.email ?? 'something@went.wrong';
  if (session !== null) {
    return (
      <>
        Signed in as {userEmail}
        <br />
        <button onClick={() => signOut()}>Sign out</button>
      </>
    );
  }
  return (
    <>
      Not signed in <br />
      <button onClick={() => signIn()}>Sign in</button>
    </>
  );
}

