import { useState } from 'react';
import { updateDriver } from '../data/storage';

export default function Profile({ driver, onDriverUpdate }) {
  const [form, setForm] = useState({
    name: driver.name,
    nameJa: driver.nameJa,
    bio: driver.bio,
    bioJa: driver.bioJa,
    experience: driver.experience,
    languages: driver.languages.join(', '),
    languagesJa: driver.languagesJa.join(', '),
    specialties: driver.specialties.join(', '),
    specialtiesJa: driver.specialtiesJa.join(', '),
    vehicleName: driver.vehicle.name,
    vehicleType: driver.vehicle.type,
    vehicleSeats: driver.vehicle.seats,
    pricePerDay: driver.pricePerDay,
  });
  const [saved, setSaved] = useState(false);

  const update = (field, value) => {
    setForm(prev => ({ ...prev, [field]: value }));
    setSaved(false);
  };

  const handleSave = (e) => {
    e.preventDefault();
    const updates = {
      name: form.name,
      nameJa: form.nameJa,
      bio: form.bio,
      bioJa: form.bioJa,
      experience: Number(form.experience),
      languages: form.languages.split(',').map(s => s.trim()).filter(Boolean),
      languagesJa: form.languagesJa.split(',').map(s => s.trim()).filter(Boolean),
      specialties: form.specialties.split(',').map(s => s.trim()).filter(Boolean),
      specialtiesJa: form.specialtiesJa.split(',').map(s => s.trim()).filter(Boolean),
      vehicle: {
        name: form.vehicleName,
        type: form.vehicleType,
        seats: Number(form.vehicleSeats),
      },
      pricePerDay: Number(form.pricePerDay),
    };
    const updated = updateDriver(driver.id, updates);
    onDriverUpdate(updated);
    setSaved(true);
    setTimeout(() => setSaved(false), 3000);
  };

  return (
    <div className="d-profile">
      <h2>Edit Profile</h2>

      <form onSubmit={handleSave} className="d-profile-form">
        <div className="d-profile-section">
          <h3>Basic Information</h3>
          <div className="form-row">
            <div className="form-group">
              <label>Name (English)</label>
              <input type="text" value={form.name} onChange={e => update('name', e.target.value)} />
            </div>
            <div className="form-group">
              <label>Name (Japanese)</label>
              <input type="text" value={form.nameJa} onChange={e => update('nameJa', e.target.value)} />
            </div>
          </div>
          <div className="form-group">
            <label>Years of Experience</label>
            <input type="number" value={form.experience} onChange={e => update('experience', e.target.value)} min="0" />
          </div>
        </div>

        <div className="d-profile-section">
          <h3>Bio</h3>
          <div className="form-group">
            <label>Bio (English)</label>
            <textarea rows={3} value={form.bio} onChange={e => update('bio', e.target.value)} />
          </div>
          <div className="form-group">
            <label>Bio (Japanese)</label>
            <textarea rows={3} value={form.bioJa} onChange={e => update('bioJa', e.target.value)} />
          </div>
        </div>

        <div className="d-profile-section">
          <h3>Languages & Specialties</h3>
          <div className="form-row">
            <div className="form-group">
              <label>Languages (comma-separated)</label>
              <input type="text" value={form.languages} onChange={e => update('languages', e.target.value)} />
            </div>
            <div className="form-group">
              <label>Languages Japanese (comma-separated)</label>
              <input type="text" value={form.languagesJa} onChange={e => update('languagesJa', e.target.value)} />
            </div>
          </div>
          <div className="form-row">
            <div className="form-group">
              <label>Specialties (comma-separated)</label>
              <input type="text" value={form.specialties} onChange={e => update('specialties', e.target.value)} />
            </div>
            <div className="form-group">
              <label>Specialties Japanese (comma-separated)</label>
              <input type="text" value={form.specialtiesJa} onChange={e => update('specialtiesJa', e.target.value)} />
            </div>
          </div>
        </div>

        <div className="d-profile-section">
          <h3>Vehicle & Pricing</h3>
          <div className="form-row">
            <div className="form-group">
              <label>Vehicle Name</label>
              <input type="text" value={form.vehicleName} onChange={e => update('vehicleName', e.target.value)} />
            </div>
            <div className="form-group">
              <label>Vehicle Type</label>
              <input type="text" value={form.vehicleType} onChange={e => update('vehicleType', e.target.value)} />
            </div>
          </div>
          <div className="form-row">
            <div className="form-group">
              <label>Seats</label>
              <input type="number" value={form.vehicleSeats} onChange={e => update('vehicleSeats', e.target.value)} min="1" max="20" />
            </div>
            <div className="form-group">
              <label>Price Per Day (¥)</label>
              <input type="number" value={form.pricePerDay} onChange={e => update('pricePerDay', e.target.value)} min="0" step="1000" />
            </div>
          </div>
        </div>

        <div className="d-profile-save">
          <button type="submit" className="btn btn-primary btn-lg">Save Changes</button>
          {saved && <span className="d-save-msg">Changes saved!</span>}
        </div>
      </form>
    </div>
  );
}
