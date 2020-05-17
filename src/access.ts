export default function(state: any) {
  const { user } = state;
  return {
    role: user && user.role,
  };
}
