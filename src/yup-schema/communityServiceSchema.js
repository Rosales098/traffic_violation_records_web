import * as yup from 'yup';

export const CommunityServiceSchema = yup
  .object({
    citation: yup.string().required('Violator is required'),
    serviceTypeId: yup.string().required('Service Type ID is required'),
    renderedTime: yup.string().required('Rendered Time is required').matches(/^[0-9]+$/, 'Numbers only'),
    status: yup.string().required('Status is required')
  })
  .required();
