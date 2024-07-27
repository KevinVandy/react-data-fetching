import { useLocation, useNavigate, useParams } from "react-router-dom";

export default function withRouter(Component: any) {
  function ComponentWithRouterProp(props: any) {
    let location = useLocation();
    let navigate = useNavigate();
    let params = useParams();
    const router = { location, navigate, params };
    return <Component {...props} {...router} />;
  }
  return ComponentWithRouterProp;
}
