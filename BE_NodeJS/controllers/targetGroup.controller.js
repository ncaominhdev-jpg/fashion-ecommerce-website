const TargetGroup = require('../models/targetGroupModel');

class TargetGroupController {
  static async getAll(req, res) {
    try {
      const groups = await TargetGroup.findAll();
      res.json({ success: true, data: groups });
    } catch (err) {
      console.error(err);
      res.status(500).json({ success: false, message: 'Server error' });
    }
  }

  static async getById(req, res) {
    try {
      const group = await TargetGroup.findByPk(req.params.id);
      if (!group) {
        return res.status(404).json({ success: false, message: 'Not found' });
      }
      res.json({ success: true, data: group });
    } catch (err) {
      console.error(err);
      res.status(500).json({ success: false, message: 'Server error' });
    }
  }

  static async create(req, res) {
    try {
      const { label } = req.body;
      if (!label) {
        return res.status(400).json({ success: false, message: 'Label is required' });
      }
      const group = await TargetGroup.create({ label });
      res.status(201).json({ success: true, data: group });
    } catch (err) {
      console.error(err);
      res.status(500).json({ success: false, message: 'Server error' });
    }
  }

  static async update(req, res) {
    try {
      const { label } = req.body;
      const group = await TargetGroup.findByPk(req.params.id);
      if (!group) {
        return res.status(404).json({ success: false, message: 'Not found' });
      }
      group.label = label || group.label;
      await group.save();
      res.json({ success: true, data: group });
    } catch (err) {
      console.error(err);
      res.status(500).json({ success: false, message: 'Server error' });
    }
  }

  static async delete(req, res) {
    try {
      const group = await TargetGroup.findByPk(req.params.id);
      if (!group) {
        return res.status(404).json({ success: false, message: 'Not found' });
      }
      await group.destroy();
      res.json({ success: true, message: 'Deleted successfully' });
    } catch (err) {
      console.error(err);
      res.status(500).json({ success: false, message: 'Server error' });
    }
  }
}

module.exports = TargetGroupController;
