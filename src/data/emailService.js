import emailjs from '@emailjs/browser';

// EmailJS configuration
// To enable real email sending:
// 1. Create account at https://www.emailjs.com/
// 2. Create an email service and template
// 3. Set these values in your .env file:
//    VITE_EMAILJS_SERVICE_ID=your_service_id
//    VITE_EMAILJS_TEMPLATE_CUSTOMER=your_customer_template_id
//    VITE_EMAILJS_TEMPLATE_DRIVER=your_driver_template_id
//    VITE_EMAILJS_PUBLIC_KEY=your_public_key

const SERVICE_ID = import.meta.env.VITE_EMAILJS_SERVICE_ID || '';
const TEMPLATE_CUSTOMER = import.meta.env.VITE_EMAILJS_TEMPLATE_CUSTOMER || '';
const TEMPLATE_DRIVER = import.meta.env.VITE_EMAILJS_TEMPLATE_DRIVER || '';
const PUBLIC_KEY = import.meta.env.VITE_EMAILJS_PUBLIC_KEY || '';

const isConfigured = SERVICE_ID && TEMPLATE_CUSTOMER && TEMPLATE_DRIVER && PUBLIC_KEY;

function logEmail(type, params) {
  const log = JSON.parse(localStorage.getItem('tbk_email_log') || '[]');
  log.push({
    type,
    params,
    timestamp: new Date().toISOString(),
    mode: isConfigured ? 'live' : 'demo',
  });
  localStorage.setItem('tbk_email_log', JSON.stringify(log));
}

export function getEmailLog() {
  return JSON.parse(localStorage.getItem('tbk_email_log') || '[]');
}

export async function sendCustomerConfirmation(booking, driver) {
  const params = {
    to_name: `${booking.guestInfo.firstName} ${booking.guestInfo.lastName}`,
    to_email: booking.guestInfo.email,
    booking_id: booking.bookingId,
    tour_date: booking.date,
    driver_name: driver.name,
    driver_phone: 'Contact via app',
    vehicle: driver.vehicle.name,
    vehicle_type: driver.vehicle.type,
    seats: driver.vehicle.seats,
    pickup_location: booking.guestInfo.hotel,
    guests: booking.guestInfo.guests,
    price: `¥${booking.price.toLocaleString()}`,
    special_requests: booking.guestInfo.notes || 'None',
  };

  logEmail('customer_confirmation', params);

  if (isConfigured) {
    try {
      await emailjs.send(SERVICE_ID, TEMPLATE_CUSTOMER, params, PUBLIC_KEY);
      return { success: true, mode: 'live' };
    } catch (err) {
      console.error('EmailJS customer send failed:', err);
      return { success: false, mode: 'live', error: err.text };
    }
  }

  return { success: true, mode: 'demo' };
}

export async function sendDriverNotification(booking, driver) {
  const params = {
    to_name: driver.name,
    to_email: `driver${driver.id}@demo.tourbooking.jp`,
    booking_id: booking.bookingId,
    tour_date: booking.date,
    guest_name: `${booking.guestInfo.firstName} ${booking.guestInfo.lastName}`,
    guest_email: booking.guestInfo.email,
    guest_phone: booking.guestInfo.phone,
    pickup_location: booking.guestInfo.hotel,
    guests: booking.guestInfo.guests,
    price: `¥${booking.price.toLocaleString()}`,
    special_requests: booking.guestInfo.notes || 'None',
  };

  logEmail('driver_notification', params);

  if (isConfigured) {
    try {
      await emailjs.send(SERVICE_ID, TEMPLATE_DRIVER, params, PUBLIC_KEY);
      return { success: true, mode: 'live' };
    } catch (err) {
      console.error('EmailJS driver send failed:', err);
      return { success: false, mode: 'live', error: err.text };
    }
  }

  return { success: true, mode: 'demo' };
}

export async function sendBookingEmails(booking, driver) {
  const [customerResult, driverResult] = await Promise.all([
    sendCustomerConfirmation(booking, driver),
    sendDriverNotification(booking, driver),
  ]);

  return {
    customer: customerResult,
    driver: driverResult,
    mode: isConfigured ? 'live' : 'demo',
  };
}
