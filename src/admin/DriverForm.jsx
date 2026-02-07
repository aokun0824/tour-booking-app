import { useState } from 'react';

const emptyForm = {
  name: '',
  nameJa: '',
  experience: 0,
  bio: '',
  bioJa: '',
  languages: 'English, Japanese',
  languagesJa: '英語, 日本語',
  specialties: '',
  specialtiesJa: '',
  vehicleName: 'Toyota',
  vehicleType: 'Sedan',
  vehicleSeats: 4,
  pricePerDay: 30000,
};

function driverToForm(d) {
  return {
    name: d.name,
    nameJa: d.nameJa,
    experience: d.experience,
    bio: d.bio,
    bioJa: d.bioJa,
    languages: d.languages.join(', '),
    languagesJa: d.languagesJa.join(', '),
    specialties: d.specialties.join(', '),
    specialtiesJa: d.specialtiesJa.join(', '),
    vehicleName: d.vehicle.name,
    vehicleType: d.vehicle.type,
    vehicleSeats: d.vehicle.seats,
    pricePerDay: d.pricePerDay,
  };
}

export default function DriverForm({ driver, onSave, onCancel }) {
  const [form, setForm] = useState(driver ? driverToForm(driver) : emptyForm);
  const [errors, setErrors] = useState({});

  const update = (field, value) => {
    setForm(prev => ({ ...prev, [field]: value }));
    if (errors[field]) setErrors(prev => ({ ...prev, [field]: null }));
  };

  const validate = () => {
    const errs = {};
    if (!form.name.trim()) errs.name = 'Required';
    if (!form.nameJa.trim()) errs.nameJa = 'Required';
    if (!form.vehicleName.trim()) errs.vehicleName = 'Required';
    if (Number(form.pricePerDay) <= 0) errs.pricePerDay = 'Must be > 0';
    setErrors(errs);
    return Object.keys(errs).length === 0;
  };

  const handleSubmit = (e) => {
    e.preventDefault();
    if (!validate()) return;
    const split = (s) => s.split(',').map(x => x.trim()).filter(Boolean);
    onSave({
      name: form.name.trim(),
      nameJa: form.nameJa.trim(),
      experience: Number(form.experience),
      bio: form.bio,
      bioJa: form.bioJa,
      languages: split(form.languages),
      languagesJa: split(form.languagesJa),
      specialties: split(form.specialties),
      specialtiesJa: split(form.specialtiesJa),
      vehicle: {
        name: form.vehicleName.trim(),
        type: form.vehicleType.trim(),
        seats: Number(form.vehicleSeats),
      },
      pricePerDay: Number(form.pricePerDay),
    });
  };

  return (
    <form onSubmit={handleSubmit} className="adm-driver-form">
      <h3>{driver ? 'Edit Driver' : 'Add New Driver'}</h3>

      <div className="adm-form-section">
        <h4>Basic Information</h4>
        <div className="form-row">
          <div className="form-group">
            <label>Name (English) *</label>
            <input type="text" value={form.name} onChange={e => update('name', e.target.value)} />
            {errors.name && <span className="form-error">{errors.name}</span>}
          </div>
          <div className="form-group">
            <label>Name (Japanese) *</label>
            <input type="text" value={form.nameJa} onChange={e => update('nameJa', e.target.value)} />
            {errors.nameJa && <span className="form-error">{errors.nameJa}</span>}
          </div>
        </div>
        <div className="form-group">
          <label>Years of Experience</label>
          <input type="number" value={form.experience} onChange={e => update('experience', e.target.value)} min="0" />
        </div>
      </div>

      <div className="adm-form-section">
        <h4>Bio</h4>
        <div className="form-group">
          <label>Bio (English)</label>
          <textarea rows={3} value={form.bio} onChange={e => update('bio', e.target.value)} />
        </div>
        <div className="form-group">
          <label>Bio (Japanese)</label>
          <textarea rows={3} value={form.bioJa} onChange={e => update('bioJa', e.target.value)} />
        </div>
      </div>

      <div className="adm-form-section">
        <h4>Languages & Specialties</h4>
        <div className="form-row">
          <div className="form-group">
            <label>Languages (comma-separated)</label>
            <input type="text" value={form.languages} onChange={e => update('languages', e.target.value)} />
          </div>
          <div className="form-group">
            <label>Languages Japanese</label>
            <input type="text" value={form.languagesJa} onChange={e => update('languagesJa', e.target.value)} />
          </div>
        </div>
        <div className="form-row">
          <div className="form-group">
            <label>Specialties (comma-separated)</label>
            <input type="text" value={form.specialties} onChange={e => update('specialties', e.target.value)} />
          </div>
          <div className="form-group">
            <label>Specialties Japanese</label>
            <input type="text" value={form.specialtiesJa} onChange={e => update('specialtiesJa', e.target.value)} />
          </div>
        </div>
      </div>

      <div className="adm-form-section">
        <h4>Vehicle & Pricing</h4>
        <div className="form-row">
          <div className="form-group">
            <label>Vehicle Name *</label>
            <input type="text" value={form.vehicleName} onChange={e => update('vehicleName', e.target.value)} />
            {errors.vehicleName && <span className="form-error">{errors.vehicleName}</span>}
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
            <label>Price Per Day (¥) *</label>
            <input type="number" value={form.pricePerDay} onChange={e => update('pricePerDay', e.target.value)} min="0" step="1000" />
            {errors.pricePerDay && <span className="form-error">{errors.pricePerDay}</span>}
          </div>
        </div>
      </div>

      <div className="adm-form-actions">
        <button type="button" className="btn btn-outline" onClick={onCancel}>Cancel</button>
        <button type="submit" className="btn btn-primary">{driver ? 'Save Changes' : 'Add Driver'}</button>
      </div>
    </form>
  );
}
