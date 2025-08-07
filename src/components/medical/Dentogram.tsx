import { useState } from 'react';
import { Card, CardContent, CardHeader, CardTitle } from '../ui/card';
import { Button } from '../ui/button';
import { Tooltip, TooltipContent, TooltipProvider, TooltipTrigger } from '../ui/tooltip';
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from '../ui/select';
import { 
  Save, 
  RotateCcw, 
  Info,
  AlertCircle,
} from 'lucide-react';
import { toast } from 'sonner';

// Tipos para el estado de cada superficie del diente
type SurfaceStatus = 'healthy' | 'cavity' | 'filling' | 'crown' | 'missing';

interface ToothData {
  number: number;
  surfaces: {
    vestibular: SurfaceStatus;
    lingual: SurfaceStatus;
    mesial: SurfaceStatus;
    distal: SurfaceStatus;
    occlusal: SurfaceStatus;
  };
  notes?: string;
}

interface DentogramProps {
  patientId: string;
  initialData?: ToothData[];
  onSave?: (data: ToothData[]) => Promise<void>;
  readOnly?: boolean;
}

const TOOTH_NUMBERS = {
  upperRight: [18, 17, 16, 15, 14, 13, 12, 11],
  upperLeft: [21, 22, 23, 24, 25, 26, 27, 28],
  lowerLeft: [38, 37, 36, 35, 34, 33, 32, 31],
  lowerRight: [41, 42, 43, 44, 45, 46, 47, 48],
};

const STATUS_COLORS = {
  healthy: '#4ade80', // verde
  cavity: '#ef4444',  // rojo
  filling: '#3b82f6', // azul
  crown: '#f59e0b',   // amarillo
  missing: '#6b7280', // gris
};

const STATUS_LABELS = {
  healthy: 'Sano',
  cavity: 'Caries',
  filling: 'Empaste',
  crown: 'Corona',
  missing: 'Ausente',
};

export const Dentogram: React.FC<DentogramProps> = ({
  patientId,
  initialData = [],
  onSave,
  readOnly = false,
}) => {
  const [teethData, setTeethData] = useState<Map<number, ToothData>>(() => {
    console.debug(patientId);
    const map = new Map();
    
    // Inicializar todos los dientes
    Object.values(TOOTH_NUMBERS).flat().forEach(number => {
      const existing = initialData.find(tooth => tooth.number === number);
      map.set(number, existing || {
        number,
        surfaces: {
          vestibular: 'healthy',
          lingual: 'healthy',
          mesial: 'healthy',
          distal: 'healthy',
          occlusal: 'healthy',
        },
      });
    });
    
    return map;
  });

  const [selectedTooth, setSelectedTooth] = useState<number | null>(null);
  const [selectedSurface, setSelectedSurface] = useState<keyof ToothData['surfaces'] | null>(null);
  const [currentStatus, setCurrentStatus] = useState<SurfaceStatus>('healthy');
  const [isModified, setIsModified] = useState(false);

  const updateToothSurface = (toothNumber: number, surface: keyof ToothData['surfaces'], status: SurfaceStatus) => {
    if (readOnly) return;
    
    setTeethData(prev => {
      const newMap = new Map(prev);
      const tooth = newMap.get(toothNumber);
      if (tooth) {
        newMap.set(toothNumber, {
          ...tooth,
          surfaces: {
            ...tooth.surfaces,
            [surface]: status,
          },
        });
      }
      return newMap;
    });
    setIsModified(true);
  };

  const getToothColor = (toothNumber: number) => {
    const tooth = teethData.get(toothNumber);
    if (!tooth) return STATUS_COLORS.healthy;

    const surfaces = Object.values(tooth.surfaces);
    
    // Si está ausente, mostrar gris
    if (surfaces.includes('missing')) return STATUS_COLORS.missing;
    
    // Si tiene caries, mostrar rojo (prioridad alta)
    if (surfaces.includes('cavity')) return STATUS_COLORS.cavity;
    
    // Si tiene corona, mostrar amarillo
    if (surfaces.includes('crown')) return STATUS_COLORS.crown;
    
    // Si tiene empaste, mostrar azul
    if (surfaces.includes('filling')) return STATUS_COLORS.filling;
    
    // Si está sano, mostrar verde
    return STATUS_COLORS.healthy;
  };

  const handleToothClick = (toothNumber: number) => {
    if (readOnly) return;
    setSelectedTooth(toothNumber);
    setSelectedSurface(null);
  };

  const handleSurfaceUpdate = (surface: keyof ToothData['surfaces']) => {
    if (!selectedTooth || readOnly) return;
    updateToothSurface(selectedTooth, surface, currentStatus);
    setSelectedSurface(surface);
  };

  const handleSave = async () => {
    if (!onSave) return;
    
    try {
      const dataArray = Array.from(teethData.values());
      await onSave(dataArray);
      setIsModified(false);
      toast.success('Dentograma guardado correctamente');
    } catch (error) {
        console.debug({error})
      toast.error('Error al guardar el dentograma');
    }
  };

  const resetDentogram = () => {
    if (readOnly) return;
    
    setTeethData(prev => {
      const newMap = new Map(prev);
      newMap.forEach((tooth, number) => {
        newMap.set(number, {
          ...tooth,
          surfaces: {
            vestibular: 'healthy',
            lingual: 'healthy',
            mesial: 'healthy',
            distal: 'healthy',
            occlusal: 'healthy',
          },
        });
      });
      return newMap;
    });
    setIsModified(true);
    toast.info('Dentograma reiniciado');
  };

  const ToothComponent: React.FC<{ number: number; quadrant: string }> = ({ number, quadrant }) => {
    const isSelected = selectedTooth === number;
    const color = getToothColor(number);
    console.debug(quadrant);
    
    return (
      <TooltipProvider>
        <Tooltip>
          <TooltipTrigger asChild>
            <div
              className={`
                relative w-12 h-12 rounded-lg border-2 cursor-pointer transition-all duration-200
                ${isSelected ? 'border-goodent-primary scale-110 shadow-lg' : 'border-border hover:border-goodent-secondary'}
                ${readOnly ? 'cursor-default' : 'hover:scale-105'}
              `}
              style={{ backgroundColor: color }}
              onClick={() => handleToothClick(number)}
            >
              <div className="absolute inset-0 flex items-center justify-center">
                <span className="text-white font-bold text-sm drop-shadow-md">
                  {number}
                </span>
              </div>
            </div>
          </TooltipTrigger>
          <TooltipContent>
            <div className="space-y-1">
              <p className="font-medium">Diente {number}</p>
              <div className="text-xs">
                {Object.entries(teethData.get(number)?.surfaces || {}).map(([surface, status]) => (
                  <div key={surface} className="flex justify-between">
                    <span className="capitalize">{surface}:</span>
                    <span className="ml-2">{STATUS_LABELS[status as SurfaceStatus]}</span>
                  </div>
                ))}
              </div>
            </div>
          </TooltipContent>
        </Tooltip>
      </TooltipProvider>
    );
  };

  return (
    <div className="space-y-6">
      {/* Header */}
      <div className="flex items-center justify-between">
        <div>
          <h3 className="text-xl font-semibold">Dentograma</h3>
          <p className="text-sm text-muted-foreground">
            {readOnly ? 'Vista del dentograma' : 'Haz clic en un diente para editar sus superficies'}
          </p>
        </div>
        
        {!readOnly && (
          <div className="flex items-center space-x-2">
            <Button
              variant="outline"
              size="sm"
              onClick={resetDentogram}
              disabled={!isModified}
            >
              <RotateCcw className="mr-2 h-4 w-4" />
              Reiniciar
            </Button>
            <Button
              onClick={handleSave}
              disabled={!isModified || !onSave}
              className="bg-goodent-primary hover:bg-goodent-primary/90"
            >
              <Save className="mr-2 h-4 w-4" />
              Guardar
            </Button>
          </div>
        )}
      </div>

      {/* Leyenda */}
      <Card>
        <CardHeader className="pb-3">
          <CardTitle className="text-sm">Leyenda</CardTitle>
        </CardHeader>
        <CardContent>
          <div className="flex flex-wrap gap-4">
            {Object.entries(STATUS_LABELS).map(([status, label]) => (
              <div key={status} className="flex items-center space-x-2">
                <div
                  className="w-4 h-4 rounded"
                  style={{ backgroundColor: STATUS_COLORS[status as SurfaceStatus] }}
                />
                <span className="text-sm">{label}</span>
              </div>
            ))}
          </div>
        </CardContent>
      </Card>

      {/* Dentograma */}
      <Card>
        <CardContent className="p-6">
          <div className="space-y-8">
            {/* Maxilar Superior */}
            <div className="space-y-4">
              <h4 className="text-center font-medium text-muted-foreground">Maxilar Superior</h4>
              <div className="flex justify-center">
                <div className="flex space-x-2">
                  {/* Derecha Superior */}
                  <div className="flex space-x-1">
                    {TOOTH_NUMBERS.upperRight.map(number => (
                      <ToothComponent key={number} number={number} quadrant="upper-right" />
                    ))}
                  </div>
                  {/* Línea central */}
                  <div className="w-px bg-border mx-4" />
                  {/* Izquierda Superior */}
                  <div className="flex space-x-1">
                    {TOOTH_NUMBERS.upperLeft.map(number => (
                      <ToothComponent key={number} number={number} quadrant="upper-left" />
                    ))}
                  </div>
                </div>
              </div>
            </div>

            {/* Maxilar Inferior */}
            <div className="space-y-4">
              <h4 className="text-center font-medium text-muted-foreground">Maxilar Inferior</h4>
              <div className="flex justify-center">
                <div className="flex space-x-2">
                  {/* Derecha Inferior */}
                  <div className="flex space-x-1">
                    {TOOTH_NUMBERS.lowerRight.reverse().map(number => (
                      <ToothComponent key={number} number={number} quadrant="lower-right" />
                    ))}
                  </div>
                  {/* Línea central */}
                  <div className="w-px bg-border mx-4" />
                  {/* Izquierda Inferior */}
                  <div className="flex space-x-1">
                    {TOOTH_NUMBERS.lowerLeft.reverse().map(number => (
                      <ToothComponent key={number} number={number} quadrant="lower-left" />
                    ))}
                  </div>
                </div>
              </div>
            </div>
          </div>
        </CardContent>
      </Card>

      {/* Panel de Edición */}
      {selectedTooth && !readOnly && (
        <Card>
          <CardHeader>
            <CardTitle className="flex items-center">
              <Info className="mr-2 h-5 w-5 text-goodent-primary" />
              Editando Diente {selectedTooth}
            </CardTitle>
          </CardHeader>
          <CardContent className="space-y-4">
            {/* Selector de Estado */}
            <div>
              <label className="text-sm font-medium">Estado a aplicar:</label>
              <Select value={currentStatus} onValueChange={(value: SurfaceStatus) => setCurrentStatus(value)}>
                <SelectTrigger className="w-full mt-1">
                  <SelectValue />
                </SelectTrigger>
                <SelectContent>
                  {Object.entries(STATUS_LABELS).map(([status, label]) => (
                    <SelectItem key={status} value={status}>
                      <div className="flex items-center space-x-2">
                        <div
                          className="w-3 h-3 rounded"
                          style={{ backgroundColor: STATUS_COLORS[status as SurfaceStatus] }}
                        />
                        <span>{label}</span>
                      </div>
                    </SelectItem>
                  ))}
                </SelectContent>
              </Select>
            </div>

            {/* Superficies */}
            <div>
              <label className="text-sm font-medium">Superficies del diente:</label>
              <div className="grid grid-cols-2 gap-2 mt-2">
                {Object.entries(teethData.get(selectedTooth)?.surfaces || {}).map(([surface, status]) => (
                  <Button
                    key={surface}
                    variant={selectedSurface === surface ? 'default' : 'outline'}
                    size="sm"
                    onClick={() => handleSurfaceUpdate(surface as keyof ToothData['surfaces'])}
                    className="justify-between"
                  >
                    <span className="capitalize">{surface}</span>
                    <div
                      className="w-3 h-3 rounded ml-2"
                      style={{ backgroundColor: STATUS_COLORS[status] }}
                    />
                  </Button>
                ))}
              </div>
            </div>

            {isModified && (
              <div className="flex items-center space-x-2 text-amber-600">
                <AlertCircle className="h-4 w-4" />
                <span className="text-sm">Hay cambios sin guardar</span>
              </div>
            )}
          </CardContent>
        </Card>
      )}
    </div>
  );
};