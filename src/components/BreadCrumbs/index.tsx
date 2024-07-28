// import React from "react";
// import { useLocation, useNavigate } from "react-router-dom";
// import { Breadcrumbs as MUIBreadcrumbs, Typography, Link } from "@mui/material";

// const Breadcrumbs = () => {
//   const { pathname } = useLocation();
//   let navigate = useNavigate();
//   const pathnames = pathname.split("/").filter((x) => x);
//   return (
//     <MUIBreadcrumbs aria-label="breadcrumb">
//       {pathnames.map((name, index) => {
//         const routeTo = `/${pathnames.slice(0, index + 1).join("/")}`;
//         const isLast = index === pathnames.length - 1;
//         return isLast ? (
//           <Typography fontWeight={"bold"} variant="h6" gutterBottom key={name}>
//             {name}
//           </Typography>
//         ) : (
//           <Typography fontWeight={"bold"} variant="h6" gutterBottom key={name}>
//             <Link key={name} onClick={() => navigate(routeTo)}>
//               {name}
//             </Link>
//           </Typography>
//         );
//       })}
//     </MUIBreadcrumbs>
//   );
// };

// export default Breadcrumbs;

import * as React from "react";
import Box from "@mui/material/Box";
import Link, { LinkProps } from "@mui/material/Link";
import Typography from "@mui/material/Typography";
import Breadcrumbs from "@mui/material/Breadcrumbs";
import {
  Link as RouterLink,
  Route,
  Routes,
  useLocation,
} from "react-router-dom";
import { BreadCrumbsMapper } from "../../utils/constants";

interface LinkRouterProps extends LinkProps {
  to: string;
  replace?: boolean;
  state?: any;
}

function LinkRouter(props: LinkRouterProps) {
  return <Link {...props} component={RouterLink as any} />;
}

function capitalizeFirstLetter(string: string) {
  return string.charAt(0).toUpperCase() + string.slice(1);
}

function Page() {
  const location = useLocation();
  const pathnames = location.pathname.split("/").filter((x) => x);

  if (pathnames.length == 0) {
    return (
      <Breadcrumbs aria-label="breadcrumb">
        <Typography
          color="text.primary"
          style={{ fontSize: "16px", fontWeight: "bold", color: "#132640" }}
          key={"Dashboard"}
        >
          Dashboard
        </Typography>
      </Breadcrumbs>
    );
  }

  return (
    <Breadcrumbs aria-label="breadcrumb">
      {pathnames.slice(1).map((value, index) => {
        const isLast = index === pathnames.length - 2;
        const to = `/${pathnames.slice(0, index + 2).join('/')}`;
        const label = BreadCrumbsMapper[value] || capitalizeFirstLetter(value);

        const crumbProps = isLast
          ? {
              component: 'span',
              style: {
                fontSize: '16px',
                fontWeight: 'bold',
                color: '#132640',
              },
            }
          : {
              component: LinkRouter,
              underline: 'hover',
              color: '#D1D3D4',
              fontWeight: 'bold',
              to,
              state: location.state,
            };

        return (
          <Typography {...crumbProps} key={to}>
            {label}
          </Typography>
        );
      })}
    </Breadcrumbs>
  );
}

export default function RouterBreadcrumbs() {
  return (
    <Box m={0}>
      <Routes>
        <Route path="*" element={<Page />} />
      </Routes>
    </Box>
  );
}
