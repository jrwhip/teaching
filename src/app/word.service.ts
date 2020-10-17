import { Injectable } from '@angular/core';
import { Observable, of } from 'rxjs';

@Injectable({
  providedIn: 'root'
})
export class WordService {

  private _allWords: any = {
    'mixed-short': {
      a: ['hat', 'black', 'cat', 'clap', 'had', 'has', 'glad', 'mad', 'map', 'ran', 'snack', 'that'],
      i: ['pig', 'hit', 'his', 'kid', 'lip', 'sick', 'ship', 'this', 'win', 'with'],
      o: ['mom', 'cost', 'chop', 'doll', 'drop', 'fox', 'hop', 'job', 'lost', 'rock', 'stop'],
      e: ['red', 'bed', 'bend', 'less', 'let', 'pet', 'sell', 'sled', 'step', 'tell', 'then', 'web', 'when'],
      u: ['cup', 'bug', 'bus', 'but', 'cut', 'dust', 'fun', 'hush', 'luck', 'must', 'nut', 'shut', 'stub', 'truck']
    },
    'core-a': {
      a_: ['hat', 'back', 'bag', 'band', 'bat', 'bath', 'cap', 'cast', 'cat', 'clap', 'dad', 'fan', 'fast', 'flag', 'flat', 'glad', 'had', 'hand', 'ham', 'jam', 'last', 'mad', 'map', 'math', 'nap', 'ran', 'snap', 'trap', 'that'],
      a_e: ['cake', 'bake', 'base', 'brave', 'chase', 'face', 'fake', 'flame', 'gate', 'gave', 'grape', 'lake', 'late', 'made', 'make', 'name', 'page', 'rake', 'late', 'made', 'make', 'name', 'page', 'rake', 'safe', 'same', 'shake', 'shape', 'skale', 'snake', 'space', 'state', 'take', 'tape', 'trade'],
      ar: ['farm', 'arm', 'art', 'bark', 'barn', 'car', 'card', 'cart', 'dark', 'dart', 'far', 'hard', 'harm', 'jar', 'march', 'mark', 'park', 'part', 'shark', 'spark', 'sharp', 'smart', 'star', 'starch', 'start', 'tar', 'tart', 'yard', 'yarn'],
      ai: ['rain', 'braid', 'brain', 'drain', 'mail', 'paid', 'pail', 'pain', 'paint', 'sail', 'stain', 'tail', 'train', 'wait']
    },
    'core-i': {
      i_: ['pig', 'big', 'fin', 'fit', 'fix', 'flip', 'gift', 'grin', 'hid', 'hill', 'him', 'hit', 'hip', 'kick', 'lick', 'lid', 'lip', 'list', 'mix', 'pin', 'print', 'rib', 'sick', 'shin', 'slim', 'swim', 'trip', 'twin', 'win'],
      i_e: ['bike', 'bite', 'bride', 'dime', 'dive', 'drive', 'five', 'glide', 'gripe', 'grime', 'hide', 'hike', 'kite', 'like', 'life', 'lime', 'mine', 'nice', 'ride', 'side', 'shine', 'slide', 'smile', 'spine', 'time', 'wide', 'wife', 'wipe', 'white'],
      ir: ['girl', 'birch', 'bird', 'birth', 'chirp', 'dirt', 'fir', 'firm', 'first', 'flirt', 'mirth', 'sir', 'shirk', 'shirt', 'skirt', 'smirk', 'stir', 'swirl', 'thirst', 'third', 'twirl', 'whirl', 'whir'],
      igh: ['night', 'bright', 'fight', 'flight', 'fright', 'high', 'light', 'might', 'right', 'sigh', 'sight', 'tight', 'thigh']
    },
    'core-o': {
      o_: ['mom', 'chop', 'chomp', 'clock', 'cloth', 'dog', 'doll', 'dot', 'drop', 'fog', 'flock', 'floss', 'frog', 'hot', 'job', 'jog', 'lock', 'log', 'lost', 'mob', 'nod', 'pot', 'pop', 'soft', 'shock', 'shop', 'stop', 'top', 'trot'],
      o_e: ['rope', 'bone', 'broke', 'choke', 'close', 'drove', 'froze', 'hole', 'home', 'hope', 'joke', 'poke', 'pole', 'probe', 'mope', 'mole', 'nose', 'note', 'robe', 'spoke', 'stone', 'stroke', 'those', 'woke'],
      or: ['fork', 'born', 'cord', 'cork', 'corn', 'force', 'form', 'fort', 'horn', 'morn', 'north', 'port', 'porch', 'pork', 'sort', 'short', 'sport', 'stork', 'storm', 'torn', 'torch', 'thorn'],
      oa: ['coat', 'coach', 'croak', 'float', 'goal', 'goat', 'groan', 'soap', 'load', 'loaf', 'road', 'soak', 'toast', 'throat']
    },
    'core-e': {
      e_: ['red', 'bed', 'beg', 'bell', 'bench', 'bend', 'best', 'bet', 'blend', 'chest', 'deck', 'desk', 'fed', 'fled', 'get', 'led', 'left', 'let', 'men', 'neck', 'shed', 'sled', 'spend', 'ten', 'test', 'web', 'wed', 'wept', 'when'],
      ee: ['feet', 'bee', 'beef', 'beep', 'beet', 'cheek', 'deed', 'deep', 'feel', 'free', 'green', 'greet', 'jeep', 'meet', 'queen', 'see', 'seed', 'sheet', 'sweet', 'speed', 'sweep', 'teen', 'teeth', 'tree', 'tweed', 'weed', 'wheel'],
      er: ['jerk', 'clerk', 'germ', 'fern', 'her', 'herd', 'nerd', 'per', 'perch', 'perk', 'perm', 'pert', 'stern', 'term', 'verb'],
      ea: ['meat', 'beach', 'beak', 'cheap', 'clean', 'dream', 'eat', 'hear', 'heat', 'leaf', 'meal', 'speak', 'team', 'wheat'],
    },
    'core-u': {
      u_: ['cup', 'bump', 'bus', 'club', 'crush', 'crust', 'cub', 'cut', 'drum', 'duck', 'fund', 'gum', 'hunt', 'hut', 'jump', 'luck', 'mud', 'plug', 'plus', 'puff', 'pup', 'rug', 'run', 'shut', 'strut', 'sum', 'sun', 'tub', 'thud'],
      u_e: ['dude', 'brute', 'crude', 'cute', 'fluke', 'huge', 'June', 'mule', 'mute', 'prune', 'rude', 'rule', 'spruce', 'truce', 'tune'],
      ur: ['turn', 'blur', 'burst', 'burn', 'burp', 'church', 'churn', 'curb', 'curl', 'curt', 'fur', 'hurl', 'hurt', 'turf', 'spurt', 'surf'],
      ue: ['blue', 'clue', 'due', 'glue', 'sue', 'true']
    },
    'ending-sorts': {
      ed: ['test', 'tested', 'act', 'acted', 'add', 'added', 'count', 'counted', 'end', 'ended', 'expect', 'expected', 'fade', 'faded', 'fold', 'folded', 'float', 'floated', 'hand', 'handed', 'hunt', 'hunted', 'invent', 'invented', 'land', 'landed', 'list', 'listed', 'melt', 'melted', 'need', 'needed', 'rent', 'rented', 'sort', 'sorted', 'skate', 'skated', 'trade', 'traded', 'twist', 'twisted', 'want', 'wanted'],
      d: ['rain', 'rained', 'burn', 'burned', 'carry', 'carried', 'climb', 'climbed', 'copy', 'copied', 'cry', 'cried', 'film', 'filmed', 'hug', 'hugged', 'learn', 'learned', 'live', 'lived', 'move', 'moved', 'obey', 'obeyed', 'play', 'played', 'pray', 'prayed', 'smell', 'smelled', 'sneeze', 'sneezed', 'snow', 'snowed', 'stay', 'stayed', 'study', 'studied', 'try', 'tried', 'worry', 'worried', 'yell', 'yelled'],
      t: ['look', 'looked', 'ask', 'asked', 'blink', 'blinked', 'camp', 'camped', 'crash', 'crashed', 'help', 'helped', 'hop', 'hopped', 'hope', 'hoped', 'jump', 'jumped', 'kick', 'kicked', 'lick', 'licked', 'like', 'liked', 'laugh', 'laughed', 'miss', 'missed', 'place', 'placed', 'push', 'pushed', 'stop', 'stopped', 'touch', 'touched', 'trap', 'trapped', 'trick', 'tricked', 'walk', 'walked', 'wish', 'wished'],
    },
    'addl-a': {
      ay: ['day', 'bay', 'clay', 'hay', 'may', 'pay', 'play', 'ray', 'say', 'spray', 'stay', 'stray', 'tray', 'way'],
      all: ['fall', 'all', 'ball', 'call', 'fall', 'hall', 'mall', 'small', 'stall', 'tall', 'wall'],
      aw: ['jaw', 'bawl', 'claw', 'draw', 'flaw', 'hawk', 'law', 'lawn', 'paw', 'raw', 'saw', 'straw', 'thaw', 'yawn'],
    },
    'addl-i': {
      ing: ['ring', 'bring', 'fling', 'king', 'sing', 'sling', 'sting', 'swing', 'thing', 'wing'],
      i: ['mind', 'bind', 'blind', 'child', 'climb', 'find', 'grind', 'kind', 'mild', 'wild'],
      y_like_i: ['my', 'by', 'cry', 'fly', 'pry', 'shy', 'sky', 'sly', 'spy', 'try', 'why'],
    },
    'addl-o': {
      rule: ['gold', 'cold', 'colt', 'fold', 'folk', 'ghost', 'hold', 'host', 'jolt', 'mold', 'old', 'post', 'sold'],
      oi: ['coin', 'boil', 'coil', 'foil', 'join', 'joint', 'moist', 'oil', 'point', 'soil', 'spoil', 'toil'],
      oo: ['boot', 'boom', 'broom', 'hoop', 'moon', 'noon', 'pool', 'roof', 'room', 'scoop', 'smooth', 'shoot', 'tool', 'tooth'],
      ow: ['mow', 'bow', 'blow', 'crow', 'know', 'flow', 'grow', 'low', 'own', 'row', 'show', 'snow', 'tow', 'throw'],
      oy: ['toy', 'boy', 'coy', 'joy', 'ploy', 'Roy', 'soy'],
      oo2: ['book', 'brook', 'cook', 'foot', 'good', 'hood', 'hook', 'look', 'shook', 'stood', 'wood'],
      ow2: ['cow', 'brown', 'clown', 'crowd', 'crown', 'down', 'frown', 'gown', 'how', 'now', 'owl', 'plow', 'town', 'now', 'wow'],
      ou: ['loud', 'cloud', 'couch', 'count', 'found', 'mouth', 'ouch', 'out', 'proud', 'round', 'scout', 'shout', 'sound', 'south'],
    },
    'addl-e': {
      ea: ['head', 'bread', 'breath', 'dead', 'deaf', 'death', 'dread', 'leapt', 'meant', 'spread', 'sweat', 'tread', 'thread', 'threat'],
      ear: ['earth', 'Earl', 'earn', 'heard', 'learn', 'pearl', 'search'],
      er_e: ['verse', 'merge', 'nerve', 'serve', 'swerve'],
      ew: ['new', 'blew', 'chew', 'crew', 'dew', 'drew', 'few', 'flew', 'grew', 'knew', 'news', 'screw', 'stew', 'threw'],
    },
    'addl-u': {
      ur_e: ['nurse', 'curse', 'curve', 'purse', 'splurge', 'surge', 'urge']
    }
  }


  constructor() { }

  public getAllWords(): Observable<any> {
    return of(this._allWords);
  }
}
