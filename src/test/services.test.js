import { beforeEach, describe, expect, it, vi } from 'vitest';
import api from '../services/api';
import { appointmentService } from '../features/cita/services/appointmentService';
import { doctorService } from '../features/medico/services/doctorService';
import { patientService } from '../features/paciente/services/patientService';
import { productService } from '../features/farmacia/services/productService';

vi.mock('../services/api', () => ({
  default: {
    get: vi.fn(),
    post: vi.fn(),
    put: vi.fn(),
    delete: vi.fn(),
  },
}));

const services = [
  { name: 'appointmentService', service: appointmentService, resource: '/appointments' },
  { name: 'doctorService', service: doctorService, resource: '/doctors' },
  { name: 'patientService', service: patientService, resource: '/patients' },
  { name: 'productService', service: productService, resource: '/products' },
];

describe('API services', () => {
  beforeEach(() => {
    vi.clearAllMocks();
  });

  services.forEach(({ name, service, resource }) => {
    describe(name, () => {
      it('gets all resources', async () => {
        api.get.mockResolvedValue({ data: [{ id: 1 }] });

        await expect(service.getAll()).resolves.toEqual([{ id: 1 }]);

        expect(api.get).toHaveBeenCalledWith(resource);
      });

      it('gets a resource by id', async () => {
        api.get.mockResolvedValue({ data: { id: 1 } });

        await expect(service.getById(1)).resolves.toEqual({ id: 1 });

        expect(api.get).toHaveBeenCalledWith(`${resource}/1`);
      });

      it('creates a resource', async () => {
        const payload = { nombre: 'Nuevo' };
        api.post.mockResolvedValue({ data: { id: 1, ...payload } });

        await expect(service.create(payload)).resolves.toEqual({ id: 1, ...payload });

        expect(api.post).toHaveBeenCalledWith(resource, payload);
      });

      it('updates a resource', async () => {
        const payload = { nombre: 'Actualizado' };
        api.put.mockResolvedValue({ data: { id: 1, ...payload } });

        await expect(service.update(1, payload)).resolves.toEqual({ id: 1, ...payload });

        expect(api.put).toHaveBeenCalledWith(`${resource}/1`, payload);
      });

      it('deletes a resource', async () => {
        api.delete.mockResolvedValue({ data: { ok: true } });

        await expect(service.delete(1)).resolves.toEqual({ ok: true });

        expect(api.delete).toHaveBeenCalledWith(`${resource}/1`);
      });
    });
  });
});
