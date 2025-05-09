import { node } from "prop-types";

/**
*	Conf of any urls
*/
export const  SITE_URL = process.env.REACT_APP_ENV === 'production' ? 'https://americasvoice.news/' : 'https://staging.americasvoice.news/';
export const  WIDGET_SITE_URL = process.env.REACT_APP_ENV === 'production' ? 'https://americasvoice.news/' : 'https://widgets.americasvoice.news/';