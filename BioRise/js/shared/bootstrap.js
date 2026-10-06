import {requireRole} from "../auth/auth-guard.js";
import {bindLogout} from "../auth/logout.js";
import {renderShell} from "./navigation.js";
import {applyTheme,bindTheme} from "./theme.js";
export function boot(role,page){const u=requireRole(role);if(!u)return null;renderShell(role,page);applyTheme();bindTheme();bindLogout();return u}
