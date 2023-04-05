// @mui
import PropTypes from 'prop-types';
import { Card, Typography, CardHeader, CardContent } from '@mui/material';
import { Timeline, TimelineDot, TimelineItem, TimelineContent, TimelineSeparator, TimelineConnector } from '@mui/lab';
// utils
import { fDateTime } from '../../../utils/formatTime';

// ----------------------------------------------------------------------

AppOrderTimeline.propTypes = {
  title: PropTypes.string,
  subheader: PropTypes.string,
  list: PropTypes.array.isRequired,
};

export default function AppOrderTimeline({ title, subheader, list, ...other }) {
  console.log(list);
  return (
    <Card {...other} sx={{ maxHeight: 500, overflowY: 'scroll', height: 500 }}>
      <CardHeader title={title} subheader={subheader} />

      <CardContent
        sx={{
          '& .MuiTimelineItem-missingOppositeContent:before': {
            display: 'none',
          },
        }}
      >
        <Timeline>
          {list?.map((item, index) => (
            <OrderItem key={item.id} item={item} isLast={index === list.length - 1} />
          ))}
        </Timeline>
      </CardContent>
    </Card>
  );
}

// ----------------------------------------------------------------------

OrderItem.propTypes = {
  isLast: PropTypes.bool,
  item: PropTypes.shape({
    time: PropTypes.instanceOf(Date),
    title: PropTypes.string,
    type: PropTypes.string,
  }),
};

function OrderItem({ item, isLast }) {
  return (
    <TimelineItem>
      <TimelineSeparator>
        <TimelineDot
          color={
            (item?.role === 'admin' && 'primary') ||
            (item?.role === 'treasurer' && 'success') ||
            (item?.role === 'enforcer' && 'warning')
          }
        />
        {isLast ? null : <TimelineConnector />}
      </TimelineSeparator>

      <TimelineContent>
        <Typography variant="subtitle2">{`${item?.first_name.charAt(0).toUpperCase() + item?.first_name.slice(1)} ${item?.middle_name?.charAt(0).toUpperCase()}. ${
          item?.last_name.charAt(0).toUpperCase() + item?.last_name.slice(1)
        }`}</Typography>

        <Typography variant="caption" sx={{ color: 'text.secondary' }}>
          {item?.role?.toUpperCase()}
        </Typography>
      </TimelineContent>
    </TimelineItem>
  );
}
